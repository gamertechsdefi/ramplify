// Core logic for off-ramp transactions
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { initializeZeroDevProvider, sendTransaction } from '../lib/zeroDev';

interface MoonPayQuote {
  quoteId: string;
  amount: number;
  fee: number;
  total: number;
}

export const initiateOffRamp = async (
  userId: string,
  amount: number,
  bankDetails: { account: string; routing: string }
) => {
  try {
    const zeroDevProvider = await initializeZeroDevProvider(userId);
    const smartAccountAddress = await zeroDevProvider.getAddress();

    // Get MoonPay sell quote
    const quoteResponse = await axios.post<MoonPayQuote>(
      'https://api.moonpay.com/v3/sell/quote',
      {
        amount,
        currency: 'ETH',
        walletAddress: smartAccountAddress,
      },
      {
        headers: { Authorization: `Api-Key ${process.env.MOONPAY_API_KEY}` },
      }
    );

    const { quoteId, total } = quoteResponse.data;

    // Initiate sell transaction
    const sellResponse = await axios.post(
      'https://api.moonpay.com/v3/sell',
      {
        quoteId,
        bankDetails,
        network: 'morphl2',
      },
      {
        headers: { Authorization: `Api-Key ${process.env.MOONPAY_API_KEY}` },
      }
    );

    const transactionId = sellResponse.data.transactionId;
    const depositAddress = sellResponse.data.depositAddress;

    // Send ETH to MoonPay deposit address
    const txHash = await sendTransaction(zeroDevProvider, depositAddress, amount.toString());

    // Store transaction in Supabase
    const { error } = await supabase.from('transactions').insert({
      id: transactionId,
      userId,
      provider: 'moonpay',
      type: 'sell',
      amount,
      currency: 'ETH',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    if (error) throw new Error('Failed to save transaction');

    // Encrypt and store bank details
    const { error: bankError } = await supabase.from('bank_details').insert({
      id: transactionId,
      userId,
      account: bankDetails.account,
      routing: bankDetails.routing,
      encrypted_details: supabase.rpc('encrypt', { data: JSON.stringify(bankDetails) }),
    });

    if (bankError) throw new Error('Failed to save bank details');

    return { transactionId, txHash };
  } catch (err) {
    throw new Error(err.message || 'Failed to initiate off-ramp');
  }
};