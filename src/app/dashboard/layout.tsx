'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  CryptoRamp
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <Link href="/dashboard/buy" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                  Buy
                </Link>
                <Link href="/dashboard/sell" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                  Sell
                </Link>
                <Link href="/dashboard/transactions" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                  Transactions
                </Link>
                <Link href="/dashboard/settings" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                  Settings
                </Link>
              </div>
              <button
                onClick={signOut}
                className="border border-blue-600 text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}