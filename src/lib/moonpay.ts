import { supabase } from './supabase';
import { Transaction } from './types';

interface MoonPayQuote {
  quoteId: string;
  baseCurrencyAmount: number;
  fee: number;
  totalAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
}

interface MoonPayBuyResponse {
  transactionId: string;
  widgetUrl: string;
}

interface MoonPaySellResponse {
  transactionId: string;
  depositAddress: string;
}

export const moonPayService = {
  async getQuote(
    amount: number,
    fiatCurrency: string,
    cryptoCurrency: string,
  ): Promise<MoonPayQuote> {
    try {
      const response = await fetch(
        `https://api.moonpay.com/v3/quote?apiKey=${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}&baseCurrencyCode=${fiatCurrency.toLowerCase()}&currencyCode=${cryptoCurrency.toLowerCase()}&amount=${amount}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Api-Key ${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`MoonPay quote API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        quoteId: data.id,
        baseCurrencyAmount: data.baseCurrencyAmount,
        fee: data.feeAmount,
        totalAmount: data.totalAmount,
        cryptoCurrency,
        fiatCurrency,
      };
    } catch (error) {
      console.error('MoonPay getQuote error:', error);
      throw new Error('Failed to fetch quote from MoonPay');
    }
  },

  async initiateBuy(
    userId: string,
    amount: number,
    fiatCurrency: string,
    cryptoCurrency: string,
    walletAddress: string,
  ): Promise<MoonPayBuyResponse> {
    try {
      const quote = await moonPayService.getQuote(amount, fiatCurrency, cryptoCurrency);
      const response = await fetch(
        `https://api.moonpay.com/v3/buy`,
        {
          method: 'POST',
          headers: {
            Authorization: `Api-Key ${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteId: quote.quoteId,
            walletAddress,
            currencyCode: cryptoCurrency.toLowerCase(),
            baseCurrencyCode: fiatCurrency.toLowerCase(),
            baseCurrencyAmount: amount,
            network: 'morphl2',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`MoonPay buy API error: ${response.statusText}`);
      }

      const data = await response.json();
      const transaction: Partial<Transaction> = {
        user_id: userId,
        type: 'buy',
        status: 'pending',
        amount_fiat: amount,
        currency_fiat: fiatCurrency,
        amount_crypto: quote.baseCurrencyAmount / quote.totalAmount,
        currency_crypto: cryptoCurrency,
        provider: 'moonpay',
        provider_tx_id: data.transactionId,
        metadata: { quote },
      };

      await supabase.from('transactions').insert(transaction);

      return {
        transactionId: data.transactionId,
        widgetUrl: `https://buy.moonpay.com/?apiKey=${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}&currencyCode=${cryptoCurrency.toLowerCase()}&walletAddress=${walletAddress}&baseCurrencyCode=${fiatCurrency.toLowerCase()}&baseCurrencyAmount=${amount}`,
      };
    } catch (error) {
      console.error('MoonPay initiateBuy error:', error);
      throw new Error('Failed to initiate buy transaction with MoonPay');
    }
  },

  async initiateSell(
    userId: string,
    amount: number,
    cryptoCurrency: string,
    bankDetails: { accountNumber: string; routingNumber: string },
  ): Promise<MoonPaySellResponse> {
    try {
      const quote = await moonPayService.getQuote(amount, 'USD', cryptoCurrency);
      const response = await fetch(
        `https://api.moonpay.com/v3/sell`,
        {
          method: 'POST',
          headers: {
            Authorization: `Api-Key ${process.env.NEXT_PUBLIC_MOONPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quoteId: quote.quoteId,
            bankDetails: {
              accountNumber: bankDetails.accountNumber,
              routingNumber: bankDetails.routingNumber,
            },
            currencyCode: cryptoCurrency.toLowerCase(),
            network: 'morphl2',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`MoonPay sell API error: ${response.statusText}`);
      }

      const data = await response.json();
      const transaction: Partial<Transaction> = {
        user_id: userId,
        type: 'sell',
        status: 'pending',
        amount_crypto: amount,
        currency_crypto: cryptoCurrency,
        amount_fiat: quote.baseCurrencyAmount,
        currency_fiat: 'USD',
        provider: 'moonpay',
        provider_tx_id: data.transactionId,
        metadata: { quote, bankDetails },
      };

      await supabase.from('transactions').insert(transaction);
      await supabase.from('bank_details').insert({
        id: data.transactionId,
        user_id: userId,
        account: bankDetails.accountNumber,
        routing: bankDetails.routingNumber,
        encrypted_details: JSON.stringify(bankDetails),
      });

      return {
        transactionId: data.transactionId,
        depositAddress: data.depositAddress,
      };
    } catch (error) {
      console.error('MoonPay initiateSell error:', error);
      throw new Error('Failed to initiate sell transaction with MoonPay');
    }
  },
};