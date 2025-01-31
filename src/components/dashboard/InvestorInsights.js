import { motion } from 'framer-motion';
import { FaUserTie, FaGlobe, FaHandshake } from 'react-icons/fa';

export default function InvestorInsights({ insights }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Investor Insights</h2>
      
      <div className="space-y-6">
        {insights?.topInvestors?.map((investor, index) => (
          <div key={investor?.id} className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={investor?.image}
                alt={investor?.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {index + 1}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{investor?.name}</h3>
              <p className="text-sm text-gray-500">{investor?.type}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{investor?.totalInvested}</p>
              <p className="text-sm text-gray-500">{investor?.portfolioCompanies} companies</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <FaUserTie className="text-blue-500 mb-2" />
          <p className="text-sm text-gray-600">Lead Investors</p>
          <p className="text-xl font-bold text-gray-900">{insights?.metrics?.leadInvestors}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <FaHandshake className="text-green-500 mb-2" />
          <p className="text-sm text-gray-600">Follow-on Rate</p>
          <p className="text-xl font-bold text-gray-900">{insights?.metrics?.followOnRate}%</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <FaGlobe className="text-purple-500 mb-2" />
          <p className="text-sm text-gray-600">Geo Diversity</p>
          <p className="text-xl font-bold text-gray-900">{insights?.metrics?.geoCount}</p>
        </div>
      </div>
    </motion.div>
  );
} 