import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User, Transaction } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
};

// Initialize database schema
export const initializeDatabase = async () => {
  const client = createServerSupabaseClient();
  try {
    // Users table
    await client.from('users').select('*').limit(1);
  } catch (err) {
    await client.rpc('create_users_table', {
      schema: `
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          smart_account_address TEXT,
          kyc_status TEXT DEFAULT 'pending',
          kyc_level INTEGER DEFAULT 0,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL
        );
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY user_access ON users USING (id = auth.uid());
      `,
    });
  }

  try {
    // Transactions table
    await client.from('transactions').select('*').limit(1);
  } catch (err) {
    await client.rpc('create_transactions_table', {
      schema: `
        CREATE TABLE transactions (
          id UUID PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          amount_fiat NUMERIC,
          amount_crypto NUMERIC,
          currency_fiat TEXT,
          currency_crypto TEXT NOT NULL,
          provider TEXT NOT NULL,
          provider_tx_id TEXT,
          blockchain_tx_hash TEXT,
          fees JSONB,
          metadata JSONB,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL
        );
        ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY user_access ON transactions USING (user_id = auth.uid());
      `,
    });
  }

  try {
    // Bank details table
    await client.from('bank_details').select('*').limit(1);
  } catch (err) {
    await client.rpc('create_bank_details_table', {
      schema: `
        CREATE TABLE bank_details (
          id UUID PRIMARY KEY,
          user_id TEXT NOT NULL,
          account TEXT NOT NULL,
          routing TEXT NOT NULL,
          encrypted_details TEXT,
          created_at TIMESTAMP NOT NULL
        );
        ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
        CREATE POLICY user_access ON bank_details USING (user_id = auth.uid());
      `,
    });
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};

export const updateUserSmartAccount = async (userId: string, smartAccountAddress: string) => {
  const client = createServerSupabaseClient();
  const { error } = await client
    .from('users')
    .update({ smart_account_address: smartAccountAddress, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update smart account: ${error.message}`);
  }
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from('transactions')
    .insert([{ ...transaction, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
  return data;
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from('transactions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
  return data;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const client = createServerSupabaseClient();
  const { data, error } = await client
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return data || [];
};