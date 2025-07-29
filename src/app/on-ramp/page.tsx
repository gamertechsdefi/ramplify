'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import BankDetailsPopup from "@/components/BankDetailsPopup";

export default function OnRamp() {
    const [nairaAmount, setNairaAmount] = useState<string>('');
    const [selectedCrypto, setSelectedCrypto] = useState<string>('USDT');
    const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>('');

    // Exchange rates and fees
    const USDT_RATE = 1700; // 1700 NGN = 1 USDT
    const ETH_RATE = 0.000001; // Keep existing ETH rate
    const PLATFORM_FEE_PERCENTAGE = 1.5; // 1.5% platform fee

    // Calculate crypto amounts with fee deduction
    const calculateCryptoAmounts = (amount: string) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return {
                grossAmount: '0.00',
                feeAmount: '0.00',
                netAmount: '0.00',
                feeInNaira: '0.00'
            };
        }

        let grossCryptoAmount: number;
        let decimals: number;

        if (selectedCrypto === 'USDT') {
            grossCryptoAmount = numAmount / USDT_RATE;
            decimals = 6;
        } else {
            grossCryptoAmount = numAmount * ETH_RATE;
            decimals = 8;
        }

        // Calculate fee amounts
        const feeInNaira = numAmount * (PLATFORM_FEE_PERCENTAGE / 100);
        const feeInCrypto = grossCryptoAmount * (PLATFORM_FEE_PERCENTAGE / 100);
        const netCryptoAmount = grossCryptoAmount - feeInCrypto;

        return {
            grossAmount: grossCryptoAmount.toFixed(decimals),
            feeAmount: feeInCrypto.toFixed(decimals),
            netAmount: netCryptoAmount.toFixed(decimals),
            feeInNaira: feeInNaira.toFixed(2)
        };
    };

    const cryptoAmounts = calculateCryptoAmounts(nairaAmount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nairaAmount || parseFloat(nairaAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (!walletAddress || walletAddress.trim().length === 0) {
            alert('Please enter your wallet address');
            return;
        }
        // Basic wallet address validation (starts with 0x and has reasonable length)
        if (!walletAddress.startsWith('0x') || walletAddress.length < 10) {
            alert('Please enter a valid wallet address (should start with 0x)');
            return;
        }
        setShowBankDetails(true);
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <main className="mt-4 flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-6">Onramp fiat</h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white border-2 border-green-300 p-6 rounded-2xl">
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-xl font-semibold text-gray-700">You&apos;ll send</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0.00"
                                value={nairaAmount}
                                onChange={(e) => setNairaAmount(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <span className="font-medium">NGN</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>

                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-sm font-medium text-gray-700">You&apos;ll receive</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none"
                                placeholder="0.00"
                                value={cryptoAmounts.netAmount}
                                disabled
                            />
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedCrypto}
                                    onChange={(e) => setSelectedCrypto(e.target.value)}
                                >
                                    <option value="USDT">USDT</option>
                                    <option value="ETH">ETH</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Exchange rate</span>
                            <span className="font-semibold">
                                {selectedCrypto === 'USDT'
                                    ? `1 USDT = ${USDT_RATE.toLocaleString()} NGN`
                                    : `1 NGN = ${ETH_RATE} ETH`
                                }
                            </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Gross amount</span>
                            <span className="font-semibold">{cryptoAmounts.grossAmount} {selectedCrypto}</span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Platform fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                            <span className="font-semibold text-red-600">-{cryptoAmounts.feeAmount} {selectedCrypto}</span>
                        </p>
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-sm font-bold text-gray-900 flex justify-between">
                                <span>You&apos;ll receive</span>
                                <span className="text-green-600">{cryptoAmounts.netAmount} {selectedCrypto}</span>
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 flex justify-between">
                            <span>Fee in NGN</span>
                            <span>₦{cryptoAmounts.feeInNaira}</span>
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-md font-semibold text-gray-700">Enter wallet address</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="text"
                                className="text-lg bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none"
                                placeholder="0x1234...abcd"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 font-bold text-xl bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors"
                    >
                        Continue
                    </button>
                </form>
            </main>

            {/* Bank Details Popup */}
            <BankDetailsPopup
                isOpen={showBankDetails}
                onClose={() => setShowBankDetails(false)}
                nairaAmount={nairaAmount}
                cryptoAmount={cryptoAmounts.netAmount}
                selectedCrypto={selectedCrypto}
                walletAddress={walletAddress}
            />
        </div>
    )
}