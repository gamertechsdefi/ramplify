'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useSmartAccount } from '@/hooks/useSmartAccount';
import { moonPayService } from '@/lib/moonpay';
import { createTransaction } from '@/lib/supabase';
import { initializeZeroDevProvider, sendTransaction } from '@/lib/zeroDev';
import { useUIStore } from '@/store/uiStore';
import { formatCurrency } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

const sellSchema = z.object({
  amount: z.number().min(0.01, 'Minimum amount is 0.01 ETH').max(100, 'Maximum amount is 100 ETH'),
  currency: z.enum(['ETH'], { required_error: 'Please select a cryptocurrency' }),
  account: z.string().min(1, 'Bank account number is required'),
  routing: z.string().min(1, 'Routing number is required'),
});

type SellForm = z.infer<typeof sellSchema>;

interface Quote {
  cryptoAmount: number;
  fiatAmount: number;
  fees: number;
  total: number;
}

export function SellForm() {
  const { user } = useAuth();
  const { smartAccountAddress, createSmartAccount } = useSmartAccount();
  const { showSuccess, showError, setLoading, isLoading } = useUIStore();
  const [quote, setQuote] = useState<Quote | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SellForm>({
    resolver: zodResolver(sellSchema),
    defaultValues: { amount: 0.1, currency: 'ETH' },
  });

  const watchedValues = watch();

  useEffect(() => {
    const getQuote = async () => {
      if (!watchedValues.amount || !watchedValues.currency) return;
      try {
        const quoteData = await moonPayService.getQuote(watchedValues.amount, 'USD', watchedValues.currency);
        setQuote({
          cryptoAmount: watchedValues.amount,
          fiatAmount: quoteData.baseCurrencyAmount,
          fees: quoteData.fee,
          total: quoteData.totalAmount,
        });
      } catch (err) {
        setQuote(null);
      }
    };
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues.amount, watchedValues.currency]);

  const onSubmit: SubmitHandler<SellForm> = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      let walletAddress = smartAccountAddress;
      if (!walletAddress) {
        const account = await createSmartAccount();
        walletAddress = account.address;
      }

      const provider = await initializeZeroDevProvider(user.id);
      const quoteResponse = await moonPayService.getQuote(data.amount, 'USD', data.currency);
      const sellResponse = await fetch('https://api.moonpay.com/v3/sell', {
        method: 'POST',
        headers: { Authorization: `Api-Key ${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}` },
        body: JSON.stringify({
          quoteId: quoteResponse.quoteId,
          bankDetails: { accountNumber: data.account, routingNumber: data.routing },
          network: 'morphl2',
        }),
      });
      const sellData = await sellResponse.json();
      const txHash = await sendTransaction(provider, sellData.depositAddress, data.amount.toString());

      const transaction = await createTransaction({
        user_id: user.id,
        type: 'sell',
        status: 'pending',
        amount_crypto: data.amount,
        currency_crypto: data.currency,
        amount_fiat: quoteResponse.baseCurrencyAmount,
        currency_fiat: 'USD',
        provider: 'moonpay',
        provider_tx_id: sellData.transactionId,
        blockchain_tx_hash: txHash,
        metadata: { quote, bankDetails: { account: data.account, routing: data.routing } },
      });

      await supabase.from('bank_details').insert({
        id: transaction.id,
        user_id: user.id,
        account: data.account,
        routing: data.routing,
        encrypted_details: JSON.stringify({ account: data.account, routing: data.routing }),
      });

      showSuccess('Sell transaction initiated!');
    } catch (err) {
      showError(err.message || 'Failed to initiate sell transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Sell Cryptocurrency</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
          <select
            id="currency"
            {...register('currency')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ETH">Ethereum (ETH)</option>
          </select>
        </div>
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
          <input
            id="account"
            {...register('account')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.account && <p className="text-sm text-red-600 mt-1">{errors.account.message}</p>}
        </div>
        <div>
          <label htmlFor="routing" className="block text-sm font-medium text-gray-700">Routing Number</label>
          <input
            id="routing"
            {...register('routing')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.routing && <p className="text-sm text-red-600 mt-1">{errors.routing.message}</p>}
        </div>
        {quote && (
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Quote</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>You'll receive:</span>
                <span>{formatCurrency(quote.fiatAmount, 'USD')}</span>
              </div>
              <div className="flex justify-between">
                <span>Fees:</span>
                <span>{formatCurrency(quote.fees, 'USD')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(quote.total, 'USD')}</span>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Sell ETH'}
        </button>
      </form>
    </div>
  );
}