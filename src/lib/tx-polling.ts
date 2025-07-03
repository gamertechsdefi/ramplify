import axios from 'axios';
import { createPublicClient, http } from 'viem';
import { morphL2 } from '@/config/network';
import { supabase } from './supabase';

export const pollTransactionStatus = async (
  transactionId: string,
  provider: 'onramper' | 'moonpay',
  txHash?: string
) => {
  const client = createPublicClient({ chain: morphL2, transport: http() });
  const interval = setInterval(async () => {
    try {
      let status = 'pending';

      // Check blockchain transaction status if txHash is provided (off-ramp)
      if (txHash) {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        if (receipt.status !== 'success') return;
      }

      // Check provider API status
      const endpoint =
        provider === 'onramper'
          ? `https://api.onramper.com/status/${transactionId}`
          : `https://api.moonpay.com/v3/transactions/${transactionId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${
            provider === 'onramper' ? process.env.ONRAMPER_API_KEY : process.env.MOONPAY_API_KEY
          }`,
        },
      });

      status = response.data.status;
      if (status === 'completed' || status === 'failed') {
        await supabase
          .from('transactions')
          .update({ status })
          .eq('id', transactionId);
        clearInterval(interval);
      }
    } catch (err) {
      console.error('Transaction polling error:', err);
    }
  }, 5000);
};