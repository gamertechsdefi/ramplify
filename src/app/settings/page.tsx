'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';
import { Sidebar } from '../dashboard/Sidebar';
import toast, { Toaster } from 'react-hot-toast';

const settingsSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { showSuccess, showError, setLoading, isLoading } = useUIStore();
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { email: user?.email || '' },
  });

  const onSubmit: SubmitHandler<SettingsForm> = async (data) => {
    setLoading(true);
    try {
      await supabase.from('users').update({ email: data.email, updated_at: new Date().toISOString() }).eq('id', user!.id);
      await supabase.auth.updateUser({ email: data.email });
      showSuccess('Settings updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-md">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                {...register('email')}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}