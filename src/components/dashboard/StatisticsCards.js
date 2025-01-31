import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaRegClock, FaRegCheckCircle } from 'react-icons/fa';
import { formatCurrency } from '@/utils/format';

export default function StatisticsCards({ stats }) {
  const cards = [
    {
      title: 'Total Funding',
      value: formatCurrency(stats?.totalFunding || 0),
      change: stats?.fundingChange || 0,
      icon: <FaChartLine className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      metric: 'vs last month'
    },
    {
      title: 'Active Investors',
      value: stats?.activeInvestors || 0,
      change: stats?.investorChange || 0,
      icon: <FaUsers className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      metric: 'new this month'
    },
    {
      title: 'Pending Due Diligence',
      value: stats?.pendingDueDiligence || 0,
      change: stats?.dueDiligenceChange || 0,
      icon: <FaRegClock className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      metric: 'requests'
    },
    {
      title: 'Completed Rounds',
      value: stats?.completedRounds || 0,
      change: stats?.roundsChange || 0,
      icon: <FaRegCheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      metric: 'this quarter'
    }
  ];

  return (
    <>
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-lg p-6 text-white`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">{card.title}</p>
              <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${card.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}%
                </span>
                <span className="text-xs opacity-60 ml-1">{card.metric}</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full"
                style={{ width: `${Math.min(100, Math.abs(card.change))}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
} 