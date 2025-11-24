'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnection } from 'wagmi';

export default function Dashboard() {
  const { isConnected } = useConnection();

  if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl font-bold mb-2">Spend & Save</h1>
            <p className="text-blue-100">Your On-Chain Financial App</p>
          </div>
          <ConnectButton />
        </div>
      );
    }
  return (
    <div>Home</div>
  )
}
