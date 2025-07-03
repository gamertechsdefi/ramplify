import { ZeroDevEthersProvider } from '@zerodev/sdk';
import { toEthers } from '@zerodev/sdk/ethers';
import { morphL2 } from '@/config/networks';
import { updateUserSmartAccount } from './supabase';

export const initializeZeroDevProvider = async (userId: string) => {
  try {
    const provider = await ZeroDevEthersProvider.init({
      projectId: process.env.ZERODEV_PROJECT_ID!,
      owner: { type: 'email', email: userId },
      chain: morphL2,
      opts: {
        paymaster: 'ALCHEMY',
        paymasterParams: { apiKey: process.env.ALCHEMY_API_KEY! },
      },
    });
    return provider;
  } catch (err) {
    console.error('ZeroDev initialization error:', err);
    throw new Error('Failed to initialize smart account');
  }
};

export const createSmartAccount = async (userId: string) => {
  try {
    const provider = await initializeZeroDevProvider(userId);
    const address = await provider.getAddress();
    await updateUserSmartAccount(userId, address);
    return { address, chain: morphL2.id, isDeployed: await provider.isAccountDeployed() };
  } catch (err) {
    console.error('Error creating smart account:', err);
    throw new Error('Failed to create smart account');
  }
};

export const getSmartAccountAddress = async (provider: ZeroDevEthersProvider) => {
  return await provider.getAddress();
};

export const sendTransaction = async (provider: ZeroDevEthersProvider, to: string, amount: string) => {
  const ethersProvider = toEthers(provider);
  const tx = { to, value: ethers.utils.parseEther(amount) };
  const txHash = await provider.sendTransaction(tx);
  return txHash;
};