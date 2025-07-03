import { onramperService } from '@/lib/onramper';
import type { OnramperConfig } from '@/lib/types';
import { useEffect, useState } from 'react';

export function useOnramper() {
  const [supportedAssets, setSupportedAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSupportedAssets = async () => {
      setIsLoading(true);
      try {
        const assets = await onramperService.getSupportedAssets();
        setSupportedAssets(assets);
      } catch (err) {
        console.error('Error loading supported assets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSupportedAssets();
  }, []);

  const getQuote = async (config: Omit<OnramperConfig, 'apiKey' | 'walletAddress'>) => {
    setIsLoading(true);
    try {
      const quote = await onramperService.getQuote(config.fiatCurrency, config.cryptoCurrency, config.amount);
      return quote;
    } finally {
      setIsLoading(false);
    }
  };

  return { supportedAssets, getQuote, isLoading };
}