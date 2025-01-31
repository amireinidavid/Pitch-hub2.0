import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FaUserTie, FaBuilding, FaGlobe } from 'react-icons/fa';

export default function InvestorDistribution({ data }) {
  // Add default data structure if data is undefined
  const defaultData = {
    labels: ['Angel Investors', 'VCs', 'Strategic', 'Others'],
    distribution: [0, 0, 0, 0],
    angelInvestors: 0,
    vcs: 0,
    international: 0,
    totalInvestors: 0,
    averageInvestmentSize: '$0',
    leadInvestors: 0
  };

  // Merge provided data with defaults
  const safeData = { ...defaultData, ...data };

  const chartData = {
    labels: safeData.labels,
    datasets: [{
      data: safeData.distribution,
      backgroundColor: [
        '#3B82F6', // blue
        '#8B5CF6', // purple
        '#10B981', // green
        '#F59E0B'  // amber
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-lg font-semibold text-white mb-6">Investor Distribution</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <FaUserTie className="text-blue-500" />
            <span className="text-sm text-gray-400">Angel Investors</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{safeData.angelInvestors}</p>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <FaBuilding className="text-purple-500" />
            <span className="text-sm text-gray-400">VCs</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{safeData.vcs}</p>
        </div>
        <div className="bg-green-500/10 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <FaGlobe className="text-green-500" />
            <span className="text-sm text-gray-400">International</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{safeData.international}%</p>
        </div>
      </div>

      <div className="relative h-64">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{safeData.totalInvestors}</p>
            <p className="text-sm text-gray-400">Total Investors</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-400">Average Investment Size</span>
          <span className="font-semibold text-white">{safeData.averageInvestmentSize}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-400">Lead Investors</span>
          <span className="font-semibold text-white">{safeData.leadInvestors}</span>
        </div>
      </div>
    </motion.div>
  );
} 