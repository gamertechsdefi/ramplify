'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email').optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => !data.newPassword || data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query || {};
  const { showSuccess, showError, setLoading, isLoading } = useUIStore();
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit: SubmitHandler<ResetForm> = async (data) => {
    setLoading(true);
    try {
      if (!token) {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email!, {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        });
        if (error) throw error;
        setEmailSent(true);
        showSuccess('Password reset email sent!');
      } else {
        const { error } = await supabase.auth.updateUser({ password: data.newPassword });
        if (error) throw error;
        showSuccess('Password updated successfully!');
        router.push('/login');
      }
    } catch (err: any) {
      showError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        {emailSent ? (
          <p className="text-center text-green-600">Check your email for a password reset link.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {!token ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    {...register('confirmNewPassword')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.confirmNewPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmNewPassword.message}</p>}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : token ? 'Update Password' : 'Send Reset Email'}
            </button>
            <p className="text-center text-sm mt-4">
              Back to <Link href="/login" className="text-blue-600 underline">Log In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}