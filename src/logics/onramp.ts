// Core logic for on-ramp transactions
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { initializeZeroDevProvider, getSmartAccountAddress } from '../lib/zeroDev';

interface OnRampResponse {
  url: string;
  transactionId: string;
}

export const initiateOnRamp = async (
  userId: string,
  amount: number,
  currency: string,
  provider: 'onramper' | 'moonpay'
) => {
  try {
    const zeroDevProvider = await initializeZeroDevProvider(userId);
    const smartAccountAddress = await getSmartAccountAddress(zeroDevProvider);

    let transactionUrl: string;
    let transactionId: string;

    if (provider === 'onramper') {
      const response = await axios.post<OnRampResponse>(
        'https://api.onramper.com/checkout',
        {
          amount,
          currency,
          destination: smartAccountAddress,
          network: 'morphl2',
        },
        {
          headers: { Authorization: `Bearer ${process.env.ONRAMPER_API_KEY}` },
        }
      );
      transactionUrl = response.data.url;
      transactionId = response.data.transactionId;
    } else {
      const response = await axios.post<OnRampResponse>(
        'https://api.moonpay.com/v3/purchase',
        {
          amount,
          currency,
          walletAddress: smartAccountAddress,
          network: 'morphl2',
        },
        {
          headers: { Authorization: `Api-Key ${process.env.MOONPAY_API_KEY}` },
        }
      );
      transactionUrl = response.data.url;
      transactionId = response.data.transactionId;
    }

    const { error } = await supabase.from('transactions').insert({
      id: transactionId,
      userId,
      provider,
      type: 'buy',
      amount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    if (error) throw new Error('Failed to save transaction');

    return { transactionUrl, transactionId };
  } catch (err) {
    throw new Error(err.message || 'Failed to initiate on-ramp');
  }
};