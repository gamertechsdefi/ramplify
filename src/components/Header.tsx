
'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full flex justify-center z-50">
      <nav className="relative w-full mx-4 md:mx-8 mt-4 backdrop-blur bg-green-950 border border-green-900 rounded-xl px-4 sm:px-6 py-4 flex items-center gap-6 shadow-md">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-2 z-10">
          <Image src="/ramplify/logo.png" alt="ramplify logo" width={50} height={50} className="rounded-xl" />
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <Link href="/" className="text-gray-300 hover:text-white px-2 transition-colors">Home</Link>
          <Link href="/on-ramp" className="text-gray-300 hover:text-white px-2 transition-colors">On-ramp</Link>
          <Link href="/off-ramp" className="text-gray-300 hover:text-white px-2 transition-colors">Off-ramp</Link>
          <span className="flex-1" />
          <Link href="/waitlist" className="border border-green-800 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-900 transition-colors">Join waitlist</Link>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto z-10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-800"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-start pt-24 md:hidden" onClick={() => setMenuOpen(false)}>
            <div className="bg-green-950 border border-green-900 rounded-xl w-11/12 max-w-xs mx-auto flex flex-col gap-4 p-6 shadow-lg relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-3 right-3 p-1 rounded hover:bg-green-900" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Link href="/" className="text-gray-300 hover:text-white text-lg px-2 py-1 rounded transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/on-ramp" className="text-gray-300 hover:text-white text-lg px-2 py-1 rounded transition-colors" onClick={() => setMenuOpen(false)}>On-ramp</Link>
              <Link href="/off-ramp" className="text-gray-300 hover:text-white text-lg px-2 py-1 rounded transition-colors" onClick={() => setMenuOpen(false)}>Off-ramp</Link>
              <Link href="/waitlist" className="border border-green-800 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-900 transition-colors mt-2 text-center" onClick={() => setMenuOpen(false)}>Join waitlist</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
