import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserTransactions } from '@/lib/supabase';
import type { Transaction } from '@/lib/types';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getUserTransactions(user.id);
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return { transactions, isLoading };
}