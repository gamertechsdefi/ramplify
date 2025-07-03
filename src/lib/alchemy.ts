import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LocalAccountSigner, type SmartAccountSigner } from '@alchemy/aa-core';
import { sepolia, polygon, mainnet } from 'viem/chains';
import type { SmartAccountConfig } from './types';

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!
const POLICY_ID = process.env.ALCHEMY_POLICY_ID!

export class SmartAccountService {
  private provider: AlchemyProvider
  private signer: SmartAccountSigner

  constructor(chain = sepolia) {
    this.provider = new AlchemyProvider({
      apiKey: API_KEY,
      chain,
      policyId: POLICY_ID,
    })
  }

  async createSmartAccount(ownerAddress: string): Promise<SmartAccountConfig> {
    try {
      // Create a smart account
      const smartAccount = await this.provider.createSmartAccountClient({
        owner: ownerAddress,
      })

      const address = await smartAccount.getAddress()
      const isDeployed = await smartAccount.isAccountDeployed()

      return {
        address,
        owner: ownerAddress,
        chain: this.provider.chain.id,
        isDeployed,
      }
    } catch (error) {
      console.error('Error creating smart account:', error)
      throw new Error('Failed to create smart account')
    }
  }

  async deploySmartAccount(smartAccountAddress: string) {
    try {
      const smartAccount = await this.provider.getSmartAccountClient({
        accountAddress: smartAccountAddress,
      })

      // Deploy the account if not already deployed
      if (!(await smartAccount.isAccountDeployed())) {
        const txHash = await smartAccount.deployAccount()
        return txHash
      }

      return null // Already deployed
    } catch (error) {
      console.error('Error deploying smart account:', error)
      throw new Error('Failed to deploy smart account')
    }
  }

  async sendTransaction(
    smartAccountAddress: string,
    to: string,
    value: bigint,
    data?: string
  ) {
    try {
      const smartAccount = await this.provider.getSmartAccountClient({
        accountAddress: smartAccountAddress,
      })

      const txHash = await smartAccount.sendTransaction({
        to,
        value,
        data,
      })

      return txHash
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw new Error('Failed to send transaction')
    }
  }

  async getBalance(smartAccountAddress: string) {
    try {
      const balance = await this.provider.getBalance({
        address: smartAccountAddress,
      })

      return balance
    } catch (error) {
      console.error('Error getting balance:', error)
      throw new Error('Failed to get balance')
    }
  }
}

export const smartAccountService = new SmartAccountService()