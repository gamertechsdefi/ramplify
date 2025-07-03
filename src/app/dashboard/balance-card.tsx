'use client';

import { useSmartAccount } from '@/hooks/useSmartAccount';
import { formatCrypto } from '@/lib/utils';

export function BalanceCard() {
  const { balance, isLoading } = useSmartAccount();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-2xl font-bold">{formatCrypto(Number(balance) / 1e18, 'ETH')}</p>
      )}
    </div>
  );
}