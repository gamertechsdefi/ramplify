'use client';

import { BuyForm } from '@/components/Onramp';
import { Sidebar } from '../Sidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function BuyPage() {
  return (
    <div className="flex">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Buy Crypto</h1>
        <BuyForm />
      </div>
    </div>
  );
}