import { supabase } from './supabase';
import { Transaction } from './types';

interface OnramperQuote {
  cryptoAmount: number;
  fiatAmount: number;
  fee: number;
  totalAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
}

interface OnramperBuyResponse {
  transactionId: string;
  widgetUrl: string;
}

export const onramperService = {
  async getQuote({
    fiatCurrency,
    cryptoCurrency,
    amount,
  }: {
    fiatCurrency: string;
    cryptoCurrency: string;
    amount: number;
  }): Promise<OnramperQuote> {
    try {
      const response = await fetch(
        `https://api.onramper.com/quote?apiKey=${process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}&fiat=${fiatCurrency}&crypto=${cryptoCurrency}&amount=${amount}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Onramper quote API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        cryptoAmount: data.cryptoAmount,
        fiatAmount: amount,
        fee: data.fee,
        totalAmount: data.totalAmount,
        cryptoCurrency,
        fiatCurrency,
      };
    } catch (error) {
      console.error('Onramper getQuote error:', error);
      throw new Error('Failed to fetch quote from Onramper');
    }
  },

  async initiateBuy(
    userId: string,
    amount: number,
    fiatCurrency: string,
    cryptoCurrency: string,
    walletAddress: string,
  ): Promise<OnramperBuyResponse> {
    try {
      const quote = await onramperService.getQuote({ fiatCurrency, cryptoCurrency, amount });
      const transaction: Partial<Transaction> = {
        user_id: userId,
        type: 'buy',
        status: 'pending',
        amount_fiat: amount,
        currency_fiat: fiatCurrency,
        amount_crypto: quote.cryptoAmount,
        currency_crypto: cryptoCurrency,
        provider: 'onramper',
        metadata: { quote },
      };

      const { data, error } = await supabase.from('transactions').insert(transaction).select('id').single();
      if (error) {
        throw new Error(`Failed to log transaction: ${error.message}`);
      }

      const widgetUrl = `https://widget.onramper.com/?apiKey=${process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}&defaultCrypto=${cryptoCurrency}&wallets=${cryptoCurrency}:${walletAddress}&defaultFiat=${fiatCurrency}&defaultAmount=${amount}`;

      return {
        transactionId: data.id,
        widgetUrl,
      };
    } catch (error) {
      console.error('Onramper initiateBuy error:', error);
      throw new Error('Failed to initiate buy transaction with Onramper');
    }
  },

  async getSupportedAssets(): Promise<{ fiatCurrencies: string[]; cryptoCurrencies: string[] }> {
    try {
      const response = await fetch(
        `https://api.onramper.com/supported`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONRAMPER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Onramper supported assets API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        fiatCurrencies: data.fiatCurrencies || ['USD', 'EUR'],
        cryptoCurrencies: data.cryptoCurrencies || ['ETH'],
      };
    } catch (error) {
      console.error('Onramper getSupportedAssets error:', error);
      return { fiatCurrencies: ['USD', 'EUR'], cryptoCurrencies: ['ETH'] };
    }
  },
};