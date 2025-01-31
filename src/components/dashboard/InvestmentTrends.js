import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/format';

export default function InvestmentTrends({ data, timeframe, onTimeframeChange }) {
  const timeframes = ['week', 'month', 'quarter', 'year'];

  // Add default data structure if data is undefined
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Investment Amount',
        data: data?.monthlyData || Array(12).fill(0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
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
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Investment Trends</h2>
        <div className="flex space-x-2">
          {timeframes?.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeframe === tf 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="grid grid-cols-3 mt-6 text-center">
        <div>
          <p className="text-sm text-gray-500">Total Investments</p>
          <p className="text-xl font-semibold text-gray-900">{data?.totalInvestments}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Amount</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(data?.averageAmount)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Growth Rate</p>
          <p className="text-xl font-semibold text-green-600">+{data?.growthRate}%</p>
        </div>
      </div>
    </motion.div>
  );
} 