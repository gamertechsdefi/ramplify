import { useState, useEffect } from 'react'
import { smartAccountService } from '../lib/alchemy'
import { updateUserSmartAccount } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import type { SmartAccountConfig } from '../lib/types'

export const useSmartAccount = () => {
  const { user, smartAccountAddress, setSmartAccountAddress } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState<bigint>(0n)

  useEffect(() => {
    if (smartAccountAddress) {
      loadBalance()
    }
  }, [smartAccountAddress])

  const createSmartAccount = async () => {
    if (!user) throw new Error('User not authenticated')
    
    setIsLoading(true)
    try {
      // For demo purposes, we'll create a random owner address
      // In production, this would be derived from user's authentication
      const tempOwner = `0x${Math.random().toString(16).substr(2, 40)}`
      
      const config = await smartAccountService.createSmartAccount(tempOwner)
      
      // Update user record with smart account address
      await updateUserSmartAccount(user.id, config.address)
      setSmartAccountAddress(config.address)
      
      return config
    } catch (error) {
      console.error('Error creating smart account:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loadBalance = async () => {
    if (!smartAccountAddress) return
    
    try {
      const balance = await smartAccountService.getBalance(smartAccountAddress)
      setBalance(balance)
    } catch (error) {
      console.error('Error loading balance:', error)
    }
  }

  const sendTransaction = async (to: string, value: bigint, data?: string) => {
    if (!smartAccountAddress) throw new Error('Smart account not created')
    
    setIsLoading(true)
    try {
      const txHash = await smartAccountService.sendTransaction(
        smartAccountAddress,
        to,
        value,
        data
      )
      
      // Refresh balance after transaction
      await loadBalance()
      
      return txHash
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    smartAccountAddress,
    balance,
    isLoading,
    createSmartAccount,
    sendTransaction,
    loadBalance,
  }
}