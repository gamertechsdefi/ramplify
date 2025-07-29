'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import OfframpWalletPopup from "@/components/OfframpWalletPopup";

interface Bank {
  id: string;
  name: string;
  code: string;
  type: string;
}

export default function OffRamp() {
    const [cryptoAmount, setCryptoAmount] = useState<string>('');
    const [selectedCrypto, setSelectedCrypto] = useState<string>('USDC');
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [accountName, setAccountName] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rateLoading, setRateLoading] = useState<boolean>(false);
    const [showWalletPopup, setShowWalletPopup] = useState<boolean>(false);

    // Platform fee
    const PLATFORM_FEE_PERCENTAGE = 1.5;

    // Fetch exchange rate from CoinGecko
    const fetchExchangeRate = async (fromCurrency: string) => {
        setRateLoading(true);
        console.log('Fetching exchange rate for:', fromCurrency);

        try {
            const response = await fetch(`/api/coingecko/rates?from=${fromCurrency}`);
            const data = await response.json();
            console.log('Rate API response:', data);

            if (data.success && data.rate) {
                setExchangeRate(data.rate);
                console.log('Set exchange rate to:', data.rate);
            } else {
                console.error('Rate API failed:', data);
                setExchangeRate(0); // Set to 0 to indicate failure
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            setExchangeRate(0); // Set to 0 to indicate failure
        } finally {
            setRateLoading(false);
        }
    };

    // Fetch banks list
    const fetchBanks = async () => {
        try {
            const response = await fetch('/api/banks');
            const data = await response.json();
            console.log('Banks response:', data);
            if (data.success) {
                setBanks(data.banks);
                console.log('Loaded banks:', data.banks.length);
            } else {
                console.error('Banks API failed:', data);
                setBanks([]); // Set empty array to indicate failure
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            setBanks([]); // Set empty array to indicate failure
        }
    };

    // Load data on component mount and when crypto changes
    useEffect(() => {
        fetchExchangeRate(selectedCrypto);
        fetchBanks();
    }, [selectedCrypto]);

    // Calculate amounts with fee deduction
    const calculateAmounts = () => {
        const numAmount = parseFloat(cryptoAmount);
        if (isNaN(numAmount) || numAmount <= 0 || exchangeRate === 0) {
            return {
                grossNaira: '0.00',
                feeAmount: '0.00',
                netNaira: '0.00',
                feeInCrypto: '0.00'
            };
        }

        const grossNaira = numAmount * exchangeRate;
        const feeInNaira = grossNaira * (PLATFORM_FEE_PERCENTAGE / 100);
        const netNaira = grossNaira - feeInNaira;
        const feeInCrypto = numAmount * (PLATFORM_FEE_PERCENTAGE / 100);

        return {
            grossNaira: grossNaira.toFixed(2),
            feeAmount: feeInNaira.toFixed(2),
            netNaira: netNaira.toFixed(2),
            feeInCrypto: feeInCrypto.toFixed(6)
        };
    };

    const amounts = calculateAmounts();

    // Form submission handler - shows popup instead of immediately processing
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
            alert('Please enter a valid crypto amount');
            return;
        }
        if (!selectedBank) {
            alert('Please select your bank');
            return;
        }
        if (!accountNumber.trim() || accountNumber.length !== 10) {
            alert('Please enter a valid 10-digit account number');
            return;
        }
        if (!accountName.trim()) {
            alert('Please enter your account name');
            return;
        }
        if (!walletAddress.trim()) {
            alert('Please enter your wallet address');
            return;
        }

        // Show wallet popup instead of immediately processing
        setShowWalletPopup(true);
    };

    // Handle confirmation from popup - actually process the transaction
    const handleConfirmTransaction = async () => {
        setIsLoading(true);
        setShowWalletPopup(false);

        try {
            // Get selected bank name
            const selectedBankData = banks.find((bank: Bank) => bank.id === selectedBank);
            const bankName = selectedBankData?.name || selectedBank;

            const response = await fetch('/api/send-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactionType: 'offramp',
                    cryptoAmount,
                    selectedCrypto,
                    nairaAmount: amounts.netNaira,
                    exchangeRate,
                    bankName,
                    accountName,
                    accountNumber,
                    walletAddress,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Offramp transaction confirmed!\n\nReference: ${data.transactionRef}\n\n📧 Our team has been notified.\n\n💰 You'll receive ₦${amounts.netNaira} in your bank account within 30 minutes after we confirm your crypto transfer.`);

                // Reset form
                setCryptoAmount('');
                setSelectedBank('');
                setAccountName('');
                setAccountNumber('');
                setWalletAddress('');
            } else {
                alert('Failed to submit offramp request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting offramp request:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <main className="mt-4 flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-6">Offramp crypto</h1>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white border-2 border-green-300 p-6 rounded-2xl">
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-xl font-semibold text-gray-700">You&apos;ll send</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0.00"
                                value={cryptoAmount}
                                onChange={(e) => setCryptoAmount(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedCrypto}
                                    onChange={(e) => setSelectedCrypto(e.target.value)}
                                >
                                    <option value="USDC">USDC</option>
                                    <option value="ETH">ETH</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>

                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-xl font-semibold text-gray-700">You&apos;ll receive</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none"
                                placeholder="0.00"
                                value={amounts.netNaira}
                                disabled
                            />
                            <div className="flex justify-end items-center gap-2">
                                <span className="font-medium">NGN</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Exchange rate</span>
                            <span className="font-semibold">
                                {rateLoading ? 'Loading...' :
                                 exchangeRate === 0 ? '❌ Rate fetch failed' :
                                 `1 ${selectedCrypto} = ₦${exchangeRate.toLocaleString()}`}
                            </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Gross amount</span>
                            <span className="font-semibold">₦{amounts.grossNaira}</span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Platform fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                            <span className="font-semibold text-red-600">-₦{amounts.feeAmount}</span>
                        </p>
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-sm font-bold text-gray-900 flex justify-between">
                                <span>You&apos;ll receive</span>
                                <span className="text-green-600">₦{amounts.netNaira}</span>
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 flex justify-between">
                            <span>Fee in {selectedCrypto}</span>
                            <span>{amounts.feeInCrypto} {selectedCrypto}</span>
                        </p>
                    </div>

                    {/* Bank Selection */}
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-md font-semibold text-gray-700">Select your bank</label>
                        <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            disabled={banks.length === 0}
                        >
                            <option value="">
                                {banks.length === 0 ? "❌ Failed to load banks" : "Choose your bank"}
                            </option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        {banks.length === 0 && (
                            <p className="text-sm text-red-600 mt-1">❌ Could not fetch banks list</p>
                        )}
                    </div>

                    {/* Account Number */}
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-md font-semibold text-gray-700">Account number</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your 10-digit account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                        />
                    </div>

                    {/* Account Name */}
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-md font-semibold text-gray-700">Account name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your full name as on bank account"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                        />
                    </div>

                    {/* Wallet Address */}
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-md font-semibold text-gray-700">Your wallet address</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter wallet address to send crypto from"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 font-bold text-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors"
                    >
                        {isLoading ? 'Processing...' : 'Continue'}
                    </button>
                </form>
            </main>

            {/* Offramp Wallet Popup */}
            <OfframpWalletPopup
                isOpen={showWalletPopup}
                onClose={() => setShowWalletPopup(false)}
                onConfirm={handleConfirmTransaction}
                cryptoAmount={cryptoAmount}
                selectedCrypto={selectedCrypto}
                nairaAmount={amounts.netNaira}
                bankName={banks.find((bank: Bank) => bank.id === selectedBank)?.name || selectedBank}
                accountName={accountName}
                accountNumber={accountNumber}
            />
        </div>
    )
}