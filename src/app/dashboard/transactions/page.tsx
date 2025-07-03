'use client';

import { TransactionList } from '../transaction-list';
import { Sidebar } from '../Sidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function TransactionsPage() {
  return (
    <div className="flex">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <TransactionList />
      </div>
    </div>
  );
}
