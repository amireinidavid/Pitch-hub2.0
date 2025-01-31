import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

export default function FundingAnalytics({ analytics }) {
  // Add default data structure if analytics is undefined
  const chartData = {
    labels: analytics?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Funding Amount',
        data: analytics?.data || Array(6).fill(0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Funding Analytics</h2>
        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>Last 3 months</option>
        </select>
      </div>

      <div className="h-64 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {analytics?.metrics?.map((metric) => (
          <div key={metric?.label} className="text-center">
            <p className="text-sm text-gray-500">{metric?.label}</p>
            <p className="text-xl font-bold text-gray-900">{metric?.value}</p>
            <p className={`text-sm ${
              metric?.change > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {metric?.change > 0 ? '↑' : '↓'} {Math.abs(metric?.change)}%
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 