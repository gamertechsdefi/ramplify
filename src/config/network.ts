import { Chain } from 'viem';

// Morph L2 network configuration (mainnet and testnet)
export const morphL2: Chain = {
  id: 2810, // Morph L2 chain ID (example; replace with actual chain ID if different)
  name: 'Morph L2',
  network: 'morphl2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.MORPH_L2_RPC_URL || 'https://rpc.morphl2.io'],
    },
    public: {
      http: [
        'https://rpc.morphl2.io',
        'https://rpc-fallback.morphl2.io', // Fallback RPC for reliability
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'MorphScan',
      url: 'https://explorer.morphl2.io',
    },
  },
  contracts: {
    // Add any specific contract addresses if needed (e.g., multicall)
    multicall3: {
      address: '0xYourMulticall3AddressHere', // Replace with actual Morph L2 multicall3 address
      blockCreated: 123456, // Replace with actual block number
    },
  },
  testnet: false, // Set to true for testnet configuration
};

// Morph L2 testnet configuration (optional, for testing)
export const morphL2Testnet: Chain = {
  id: 2811, // Example testnet chain ID
  name: 'Morph L2 Testnet',
  network: 'morphl2-testnet',
  nativeCurrency: {
    name: 'Test Ether',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.MORPH_L2_TESTNET_RPC_URL || 'https://rpc-testnet.morphl2.io'],
    },
    public: {
      http: ['https://rpc-testnet.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MorphTestnetScan',
      url: 'https://explorer-testnet.morphl2.io',
    },
  },
  testnet: true,
};

// Export network configurations
export const networks = {
  morphL2,
  morphL2Testnet,
};
