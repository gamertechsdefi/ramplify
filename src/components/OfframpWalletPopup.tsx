'use client';

import { useState } from 'react';

interface OfframpWalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cryptoAmount: string;
  selectedCrypto: string;
  nairaAmount: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export default function OfframpWalletPopup({ 
  isOpen, 
  onClose, 
  onConfirm,
  cryptoAmount,
  selectedCrypto,
  nairaAmount,
  bankName,
  accountName,
  accountNumber
}: OfframpWalletPopupProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Wallet addresses for different cryptocurrencies
  const walletAddresses = {
    USDT: '0x996bA879273C22ebd4f99Df39b84DE43c957D70E',
    ETH: '0x996bA879273C22ebd4f99Df39b84DE43c957D70E',
  };

  const walletAddress = walletAddresses[selectedCrypto as keyof typeof walletAddresses] || walletAddresses.USDT;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-green-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Send Your Crypto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close popup"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Summary */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">🔄 Offramp Transaction</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">You&apos;re sending:</span>
                <span className="font-semibold">{cryptoAmount} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You&apos;ll receive:</span>
                <span className="font-semibold">₦{parseFloat(nairaAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-semibold">{bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account:</span>
                <span className="font-semibold">{accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-semibold">{accountNumber}</span>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Send {cryptoAmount} {selectedCrypto} to this address:</h3>
            
            <div className="bg-gray-50 border-2 border-green-300 rounded-xl p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Wallet Address ({selectedCrypto})</p>
                  <p className="font-mono text-sm bg-white p-3 rounded-lg border break-all">
                    {walletAddress}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copy wallet address"
                >
                  {copied ? (
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2">✅ Address copied to clipboard!</p>
              )}
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-1">Important Instructions:</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Send exactly <strong>{cryptoAmount} {selectedCrypto}</strong> to the address above</li>
                  <li>• Make sure you&apos;re sending on the correct network (Morph L2)</li>
                  <li>• Your naira will be sent within 30 minutes after confirmation</li>
                  <li>• Do not send any other cryptocurrency to this address</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              I&apos;ve Sent the Crypto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
