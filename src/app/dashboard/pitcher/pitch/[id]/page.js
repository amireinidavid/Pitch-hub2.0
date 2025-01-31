'use client';
import { useEffect, useState } from 'react';
import { 
  fetchPitchInvestmentDetailsAction,
  fetchPitchFundingRoundDetailsAction,
  fetchPitchInvestorActivityAction 
} from '@/actions';
import InvestmentMetrics from '@/components/dashboard/InvestmentMetrics';
import InvestorActivity from '@/components/dashboard/InvestorActivity';
import FundingRoundDetails from '@/components/dashboard/FundingRoundDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PitchDetails({ params }) {
  const [pitchData, setPitchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPitchData = async () => {
      const [investmentDetails, fundingDetails, activity] = await Promise.all([
        fetchPitchInvestmentDetailsAction(params.id),
        fetchPitchFundingRoundDetailsAction(params.id),
        fetchPitchInvestorActivityAction(params.id)
      ]);

      setPitchData({
        investmentDetails: investmentDetails.success ? investmentDetails : null,
        fundingDetails: fundingDetails.success ? fundingDetails : null,
        activity: activity.success ? activity : null
      });
      setLoading(false);
    };

    loadPitchData();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {pitchData?.investmentDetails?.pitch?.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentMetrics metrics={pitchData?.investmentDetails?.metrics} />
        <FundingRoundDetails 
          roundData={pitchData?.fundingDetails?.currentRound}
          metrics={pitchData?.fundingDetails?.roundMetrics}
        />
      </div>

      <div className="mt-8">
        <InvestorActivity activity={pitchData?.activity?.recentActivity} />
      </div>
    </div>
  );
} 