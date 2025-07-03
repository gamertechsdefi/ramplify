'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold text-blue-600">
          CryptoRamp
        </Link>
        {user && (
          <button
            onClick={signOut}
            className="border border-blue-600 text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}