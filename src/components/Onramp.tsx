'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useSmartAccount } from '@/hooks/useSmartAccount';
import { useOnramper } from '@/hooks/useOnramper';
import { createTransaction } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';
import { formatCurrency, formatCrypto } from '@/lib/utils';
import { ProviderSelector } from './provider-selector';
import toast, { Toaster } from 'react-hot-toast';

const buySchema = z.object({
  amount: z.number().min(10, 'Minimum amount is $10').max(10000, 'Maximum amount is $10,000'),
  fiatCurrency: z.enum(['USD', 'EUR'], { required_error: 'Please select a fiat currency' }),
  cryptoCurrency: z.enum(['ETH'], { required_error: 'Please select a cryptocurrency' }),
  provider: z.enum(['onramper', 'moonpay'], { required_error: 'Please select a provider' }),
});

type BuyForm = z.infer<typeof buySchema>;

interface Quote {
  cryptoAmount: number;
  fiatAmount: number;
  fees: number;
  total: number;
}

export function BuyForm() {
  const { user } = useAuth();
  const { smartAccountAddress, createSmartAccount } = useSmartAccount();
  const { getQuote, supportedAssets, isLoading: onramperLoading } = useOnramper();
  const { showSuccess, showError, setLoading, isLoading } = useUIStore();
  const [quote, setQuote] = useState<Quote | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BuyForm>({
    resolver: zodResolver(buySchema),
    defaultValues: { amount: 100, fiatCurrency: 'USD', cryptoCurrency: 'ETH', provider: 'onramper' },
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchQuote = async () => {
      if (!watchedValues.amount || !watchedValues.fiatCurrency || !watchedValues.cryptoCurrency) return;
      try {
        const quoteData = await getQuote({
          fiatCurrency: watchedValues.fiatCurrency,
          cryptoCurrency: watchedValues.cryptoCurrency,
          amount: watchedValues.amount,
        });
        setQuote({
          cryptoAmount: quoteData.cryptoAmount,
          fiatAmount: watchedValues.amount,
          fees: quoteData.fee,
          total: quoteData.totalAmount,
        });
      } catch (err) {
        setQuote(null);
      }
    };
    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedValues.amount, watchedValues.fiatCurrency, watchedValues.cryptoCurrency, getQuote]);

  const onSubmit: SubmitHandler<BuyForm> = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      let walletAddress = smartAccountAddress;
      if (!walletAddress) {
        const account = await createSmartAccount();
        walletAddress = account.address;
      }

      const transaction = await createTransaction({
        user_id: user.id,
        type: 'buy',
        status: 'pending',
        amount_fiat: data.amount,
        currency_fiat: data.fiatCurrency,
        amount_crypto: quote?.cryptoAmount,
        currency_crypto: data.cryptoCurrency,
        provider: data.provider,
        metadata: { quote },
      });

      const widgetUrl = data.provider === 'onramper'
        ? `https://widget.onramper.com/?apiKey=${process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}&defaultCrypto=${data.cryptoCurrency}&wallets=${data.cryptoCurrency}:${walletAddress}&defaultFiat=${data.fiatCurrency}&defaultAmount=${data.amount}`
        : `https://buy.moonpay.com/?apiKey=${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}¤cyCode=${data.cryptoCurrency}&walletAddress=${walletAddress}&baseCurrencyCode=${data.fiatCurrency}&baseCurrencyAmount=${data.amount}`;

      window.open(widgetUrl, '_blank');
      showSuccess('Buy transaction initiated! Complete payment in the opened widget.');
      await createTransaction({ ...transaction, provider_tx_id: transaction.id });
    } catch (err: any) {
      showError(err.message || 'Failed to initiate buy transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Buy Cryptocurrency</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
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
          <label htmlFor="fiatCurrency" className="block text-sm font-medium text-gray-700">Fiat Currency</label>
          <select
            id="fiatCurrency"
            {...register('fiatCurrency')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          {errors.fiatCurrency && <p className="text-sm text-red-600 mt-1">{errors.fiatCurrency.message}</p>}
        </div>
        <div>
          <label htmlFor="cryptoCurrency" className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
          <select
            id="cryptoCurrency"
            {...register('cryptoCurrency')}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ETH">Ethereum (ETH)</option>
          </select>
          {errors.cryptoCurrency && <p className="text-sm text-red-600 mt-1">{errors.cryptoCurrency.message}</p>}
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
          <ProviderSelector
            {...register('provider')}
            providers={[
              { value: 'onramper', label: 'Onramper' },
              { value: 'moonpay', label: 'MoonPay' },
            ]}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.provider && <p className="text-sm text-red-600 mt-1">{errors.provider.message}</p>}
        </div>
        {quote && (
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Quote</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>You'll receive:</span>
                <span>{formatCrypto(quote.cryptoAmount, 'ETH')}</span>
              </div>
              <div className="flex justify-between">
                <span>Fees:</span>
                <span>{formatCurrency(quote.fees, watchedValues.fiatCurrency)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(quote.total, watchedValues.fiatCurrency)}</span>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading || onramperLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading || onramperLoading ? 'Processing...' : 'Buy Now'}
        </button>
      </form>
    </div>
  );
}
