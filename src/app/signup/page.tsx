'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });
  const { signUp } = useAuth();
  const { showSuccess, showError, setLoading, isLoading } = useUIStore();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    setLoading(true);
    try {
      const { error } = await signUp(data.email, data.password);
      if (error) throw new Error(error.message);
      showSuccess('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      showError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-right" />
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <p className="text-center text-sm mt-4">
            Already have an account? <Link href="/login" className="text-blue-600 underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}