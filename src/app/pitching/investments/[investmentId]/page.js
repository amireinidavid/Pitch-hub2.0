'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Shield,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';
import { getInvestmentByIdAction, reviewInvestmentAction } from '@/actions';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/format';
import Loading from '@/app/loading';

export default function InvestmentDetails() {
  const { investmentId } = useParams();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const result = await getInvestmentByIdAction(investmentId);
        if (result.success) {
          setInvestment(result.investment);
        } else {
          toast({
            title: "Error!",
            description: "Failed to get Investment",
            variant: "error",
          });
        }
      } catch (error) {
        console.error('Error fetching investment:', error);
        toast({
          title: "Error!",
          description: "Failed to get Investment",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [investmentId]);

  const handleApprove = async () => {
    try {
      const result = await reviewInvestmentAction(investmentId, {
        status: 'approved',
        feedback: reviewNotes
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: "Investment approved and sent for admin review",
          variant: "success",
        });
        // Refresh investment data
        const updatedInvestment = await getInvestmentByIdAction(investmentId);
        if (updatedInvestment.success) {
          setInvestment(updatedInvestment.investment);
        }
      } else {
        toast({
          title: "Error!",
          description: result.error || "Failed to approve investment",
          variant: "error",
        });
      }
    } catch (error) {
      console.error('Error approving investment:', error);
      toast({
        title: "Error!",
        description: "Failed to approve investment",
        variant: "error",
      });
    }
  };

  if (loading) return <Loading />;
  if (!investment) return <div>Investment not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Investment Review
            </h1>
            <p className="text-gray-400">
              Investment ID: {investmentId}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium
              ${investment.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 
                investment.status === 'pitcher_approved' ? 'bg-green-500/20 text-green-500' : 
                'bg-red-500/20 text-red-500'}`}
            >
              {investment.status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
            {investment.status === 'pending' && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Approve Investment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Details */}
          <Section title="Investment Details">
            <div className="grid grid-cols-2 gap-6">
              <DetailItem 
                label="Amount" 
                value={formatCurrency(investment.amount)}
              />
              <DetailItem 
                label="Investment Type" 
                value={investment?.investmentType}
              />
              <DetailItem 
                label="Payment Method" 
                value={investment?.paymentMethod}
              />
              <DetailItem 
                label="Holding Period" 
                value={`${investment?.expectedHoldingPeriod} years`}
              />
            </div>
          </Section>

          {/* Investment Thesis */}
          <Section title="Investment Thesis">
            <p className="text-gray-300 whitespace-pre-wrap">
              {investment?.investmentThesis}
            </p>
          </Section>

          {/* Due Diligence */}
          <Section title="Due Diligence Status">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(investment?.dueDiligence).map(([key, completed]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg border ${
                    completed ? 'border-green-500/20 bg-green-500/5' : 
                    'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-500" />
                    )}
                    <span className={`text-sm ${
                      completed ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Risk Analysis */}
          <Section title="Risk Analysis">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {investment?.keyRiskFactors.map((risk, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm"
                  >
                    {risk}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Mitigation Strategies</h4>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {investment?.mitigationStrategies}
                </p>
              </div>
            </div>
          </Section>

          {/* Review Section - Only show if status is pending */}
          {investment.status === 'pending' && (
            <Section title="Review Decision">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Feedback Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    rows={4}
                    placeholder="Add any notes or feedback for the investor..."
                  />
                </div>
                <button
                  onClick={handleApprove}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Approve Investment
                </button>
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investor Profile */}
          <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">
              Investor Profile
            </h3>
            <div className="space-y-4">
              <DetailItem 
                label="Investment Experience" 
                value={investment?.investorProfile?.investmentExperience}
              />
              <DetailItem 
                label="Sector Expertise" 
                value={investment?.investorProfile?.sectorExpertise}
              />
              <DetailItem 
                label="Accreditation Status" 
                value={investment?.investorProfile?.accreditationStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const Section = ({ title, children }) => (
  <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-gray-400 block mb-1">{label}</span>
    <span className="text-white capitalize">{value}</span>
  </div>
);