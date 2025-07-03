'use client';

import { SellForm } from '@/components/Offapmp';
import { Sidebar } from '../Sidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function SellPage() {
  return (
    <div className="flex">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Sell Crypto</h1>
        <SellForm />
      </div>
    </div>
  );
}