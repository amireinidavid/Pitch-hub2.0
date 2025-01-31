import Link from 'next/link';
import { formatCurrency } from '@/utils/format';

export default function PitchOverview({ pitch }) {
  if (!pitch) return null;

  const getFundingProgress = () => {
    const current = pitch?.fundingDetails?.currentRound?.currentAmount || 0;
    const target = pitch?.fundingDetails?.currentRound?.targetAmount || 0;
    return target > 0 ? (current / target) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{pitch.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            pitch.status === 'active' ? 'bg-green-100 text-green-800' :
            pitch.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {pitch.status?.charAt(0).toUpperCase() + pitch.status?.slice(1)}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Company Stage</p>
            <p className="font-medium text-gray-900">{pitch.companyDetails?.stage || 'Not specified'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Funding Progress</p>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${getFundingProgress()}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-gray-600">
                  {formatCurrency(pitch.fundingDetails?.currentRound?.currentAmount || 0)}
                </span>
                <span className="text-gray-600">
                  {formatCurrency(pitch.fundingDetails?.currentRound?.targetAmount || 0)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Investors</p>
            <p className="font-medium text-gray-900">
              {pitch.investments?.length || 0}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            href={`/pitching/dashboard/${pitch?._id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors duration-200"
          >
            View Details
          </Link>
          <Link
            href={`/pitcher/pitch/${pitch?._id}/investments`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-center hover:bg-gray-200 transition-colors duration-200"
          >
            Investments
          </Link>
        </div>
      </div>
    </div>
  );
} 