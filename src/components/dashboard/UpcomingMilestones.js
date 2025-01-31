import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaFlag, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function UpcomingMilestones({ milestones }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Milestones</h2>
      <div className="space-y-4">
        {milestones?.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl ${
              milestone?.status === 'completed' ? 'bg-green-50' :
              milestone?.status === 'upcoming' ? 'bg-blue-50' :
              'bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${
                  milestone?.status === 'completed' ? 'text-green-500' :
                  milestone?.status === 'upcoming' ? 'text-blue-500' :
                  'text-yellow-500'
                }`}>
                  {milestone?.status === 'completed' ? <FaCheckCircle /> :
                   milestone?.status === 'upcoming' ? <FaClock /> :
                   <FaFlag />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{milestone?.title}</h3>
                  <p className="text-sm text-gray-500">{milestone?.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {format(new Date(milestone?.dueDate), 'MMM dd, yyyy')}
                    </span>
                    {milestone?.status === 'in_progress' && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {milestone?.completion && (
                <div className="ml-4">
                  <div className="w-12 h-12 rounded-full border-4 border-green-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">
                      {milestone?.completion}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            {milestone?.subtasks && (
              <div className="mt-3 pl-8">
                <div className="space-y-2">
                  {milestone?.subtasks?.map((subtask, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={subtask?.completed}
                        className="text-blue-600 rounded"
                        readOnly
                      />
                      <span className={`text-sm ${
                        subtask?.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                      }`}>
                        {subtask?.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 