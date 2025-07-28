import Header from "@/components/Header";

export default function OffRamp() {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* <h1 className="text-2xl font-bold text-center mb-6">Off ramp crypto</h1> */}
                <form className="w-full flex flex-col gap-4 bg-white border-2 border-green-300 p-6 rounded-2xl">
                    <div className="w-full flex flex-col gap-2 bg-green-100 p-4 rounded-xl">
                        <label className="text-xl font-semibold text-gray-700">You'll send</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0.00"
                            />
                            <div className="flex items-center gap-2">
                                <select>
                                    <option value="NGN">USDC</option>
                                    <option value="NGN">ETH</option>
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
                        <label className="text-xl font-semibold text-gray-700">You'll recieve</label>
                        <div className="flex justify-between items-center w-full">
                            <input
                                type="number"
                                className="text-2xl bg-transparent border-0 p-0 w-full focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0.00"
                                disabled
                            />
                            <div className="flex justify-end items-center gap-2">
                                <span className="font-medium">NGN</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Exchange rate</span>
                            <span className="font-semibold">1 USDC = NGN 1000</span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 flex justify-between">
                            <span>Protocol fee</span>
                            <span className="font-semibold">1.5%</span>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 font-bold text-xl bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors"
                    >
                        Continue
                    </button>
                </form>
            </main>
        </div>
    )
}