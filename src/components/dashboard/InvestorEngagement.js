import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';

export default function InvestorEngagement({ data }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
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
        <h2 className="text-xl font-semibold text-gray-800">Investor Engagement</h2>
        <div className="flex space-x-2">
          {['Week', 'Month', 'Quarter'].map((period) => (
            <button
              key={period}
              className="px-3 py-1 text-sm rounded-full hover:bg-gray-100"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <Bar data={data?.chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Meetings Scheduled</p>
          <p className="text-2xl font-bold text-gray-900">{data?.meetings}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Due Diligence</p>
          <p className="text-2xl font-bold text-gray-900">{data?.dueDiligence}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Follow-ups</p>
          <p className="text-2xl font-bold text-gray-900">{data?.followUps}</p>
        </div>
      </div>
    </motion.div>
  );
} 