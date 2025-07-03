'use client';

import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster position="top-right" />
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to CryptoRamp</h1>
                <p className="text-lg mb-6">Your gateway to buying and selling cryptocurrency with ease.</p>
                <div className="flex gap-4 justify-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        <Link href="/signup">Get Started</Link>
                    </button>
                    <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                        <Link href="/login">Sign In</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}