import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export default function RecentActivities({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
      <div className="space-y-6">
        {activities?.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="relative">
              <Image
                src={activity?.userImage}
                alt={activity?.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                activity?.type === 'investment' ? 'bg-green-400' :
                activity?.type === 'message' ? 'bg-blue-400' :
                'bg-yellow-400'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity?.userName}</p>
                  <p className="text-sm text-gray-500">{activity?.description}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity?.timestamp), { addSuffix: true })}
                </span>
              </div>
              {activity?.type === 'investment' && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Investment Amount</span>
                    <span className="font-semibold text-gray-900">{activity?.amount}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 