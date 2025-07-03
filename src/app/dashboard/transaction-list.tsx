'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, formatCrypto } from '@/lib/utils';

export function TransactionList() {
  const { transactions, isLoading } = useTransactions();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border-b pb-2">
              <p className="font-medium">{tx.type.toUpperCase()} - {tx.status}</p>
              <p className="text-sm text-gray-600">
                {tx.amount_fiat ? formatCurrency(tx.amount_fiat, tx.currency_fiat!) : formatCrypto(tx.amount_crypto!, tx.currency_crypto)}
              </p>
              <p className="text-sm text-gray-600">Provider: {tx.provider}</p>
              {tx.blockchain_tx_hash && (
                <p className="text-sm text-gray-600">Tx Hash: {tx.blockchain_tx_hash.slice(0, 8)}...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}