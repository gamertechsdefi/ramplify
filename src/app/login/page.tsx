
'use client';

import { LoginForm } from './Form';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <LoginForm />
    </div>
  );
}