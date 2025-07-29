'use client';

import { useState } from 'react';

interface BankDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  nairaAmount: string;
  cryptoAmount: string;
  selectedCrypto: string;
  walletAddress: string;
}

export default function BankDetailsPopup({
  isOpen,
  onClose,
  nairaAmount,
  cryptoAmount,
  selectedCrypto,
  walletAddress
}: BankDetailsPopupProps) {
  const [copied, setCopied] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Bank details (you can modify these)
  const bankDetails = {
    bankName: "Opay",
    accountName: "Jolaosho Oluwaseun",
    accountNumber: "9063269244",
    // sortCode: "011151003"
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSentPayment = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nairaAmount,
          cryptoAmount,
          selectedCrypto,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Transaction submitted successfully!\n\nReference: ${data.transactionRef}\n\n🚀 You will receive your crypto within 10 minutes.`);
        onClose();
      } else {
        alert('Failed to send transaction notification. Please contact support.');
      }
    } catch (error) {
      console.error('Error sending transaction details:', error);
      alert('An error occurred. Please contact support with your transaction details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-green-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Send Payment</h2>
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">You're sending:</span>
                <span className="font-semibold">₦{parseFloat(nairaAmount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You'll receive:</span>
                <span className="font-semibold">{cryptoAmount} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exchange rate:</span>
                <span className="font-semibold">
                  {selectedCrypto === 'USDC' ? '1 USDC = ₦1,700' : '1 NGN = 0.000001 ETH'}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Send money to this account:</h3>
            
            {/* Bank Name */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-semibold text-gray-900">{bankDetails.bankName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy bank name"
                >
                  {copied === 'bankName' ? (
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
            </div>

            {/* Account Name */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-semibold text-gray-900">{bankDetails.accountName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy account name"
                >
                  {copied === 'accountName' ? (
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
            </div>

            {/* Account Number */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-semibold text-gray-900 text-lg tracking-wider">{bankDetails.accountNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy account number"
                >
                  {copied === 'accountNumber' ? (
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
            </div>

            {/* Sort Code */}
            {/* <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Sort Code</p>
                  <p className="font-semibold text-gray-900">{bankDetails.sortCode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(bankDetails.sortCode, 'sortCode')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy sort code"
                >
                  {copied === 'sortCode' ? (
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
            </div> */}
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-1">Important:</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Send exactly ₦{parseFloat(nairaAmount || '0').toLocaleString()}</li>
                  <li>• Use "Ramplify-{Date.now().toString().slice(-6)}" as reference</li>
                  <li>• Your crypto will be sent within 10 minutes after confirmation</li>
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
              onClick={handleSentPayment}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {isSubmitting ? 'Sending...' : "I've Sent Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
