import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        {/* landing page section */}
        <section className="min-h-screen flex gap-2 flex-col items-center justify-center">
         <h1 className="text-4xl font-bold">Enter & Exit Web3 Freely & Instantly With Ramplify</h1>
         <p>Connect your wallet and start exploring the world of Web3.</p>

         <div className="flex gap-2">
          <Link href="/on-ramp" className="bg-[#B2D8B9] px-8 py-4 rounded-full">On-Ramp</Link>
          <Link href="/off-ramp" className="bg-[#B2D8B9] px-8 py-4 rounded-full">Off-Ramp</Link>
        </div>
        </section>
      </main>
    </div>
  );
}
