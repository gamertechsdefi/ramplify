export interface User {
  id: string;
  email: string;
  smart_account_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount_fiat?: number;
  amount_crypto?: number;
  currency_fiat?: string;
  currency_crypto: string;
  provider: string;
  provider_tx_id?: string;
  blockchain_tx_hash?: string;
  fees?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SmartAccountConfig {
  address: string;
  owner: string;
  chain: number;
  isDeployed: boolean;
}

export interface OnramperConfig {
  apiKey: string;
  walletAddress: string;
  fiatCurrency: string;
  cryptoCurrency: string;
  amount: number;
  email?: string;
}

export interface MoonPayConfig {
  apiKey: string;
  walletAddress: string;
  currencyCode: string;
  baseCurrencyAmount?: number;
  email?: string;
}

export interface BankDetails {
  account: string;
  routing: string;
}