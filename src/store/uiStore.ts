import { create } from 'zustand';
import { toast } from 'react-hot-toast';

interface UIState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  showSuccess: (message) => toast.success(message, { duration: 4000 }),
  showError: (message) => toast.error(message, { duration: 4000 }),
}));