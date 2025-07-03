export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} CryptoRamp. All rights reserved.</p>
      </div>
    </footer>
  );
}