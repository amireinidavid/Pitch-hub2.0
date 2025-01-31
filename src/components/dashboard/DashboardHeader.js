import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function DashboardHeader({ user, totalFunding, activeInvestors }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src={user?.imageUrl || '/default-avatar.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
            <p className="text-gray-500">Here's what's happening with your pitches today</p>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Funding Raised</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFunding)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Active Investors</p>
            <p className="text-2xl font-bold text-gray-900">{activeInvestors}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 