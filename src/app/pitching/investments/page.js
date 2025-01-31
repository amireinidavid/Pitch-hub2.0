'use client';

import { useEffect, useState } from 'react';
import { getAllInvestmentsAction } from '@/actions';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield, 
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchInvestments = async () => {
      const result = await getAllInvestmentsAction();
      if (result.success) {
        setInvestments(result.investments);
      }
      setLoading(false);
    };

    fetchInvestments();
  }, []);

  // Filter and sort investments
  const filteredInvestments = investments
    .filter(investment => {
      if (filter === 'all') return true;
      return investment.status === filter;
    })
    .filter(investment => 
      investment.pitchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.investorProfile?.sectorExpertise.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'date':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Investment Requests</h1>
          <p className="text-gray-400 mt-2">
            Manage and review all investment requests for your pitches
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by pitch or investor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#1e293b] border border-white/5 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[#1e293b] border border-white/5 rounded-lg px-4 py-2 text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Investment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInvestments.map((investment) => (
          <motion.div
            key={investment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {investment.pitchTitle}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {investment.pitchIndustry}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  investment.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                  investment.status === 'accepted' ? 'bg-green-500/20 text-green-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(investment.amount)}
                  </p>
                  <p className="text-sm text-gray-400">Investment Amount</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Investment Type</p>
                  <p className="text-white capitalize">{investment.investmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Holding Period</p>
                  <p className="text-white">{investment.expectedHoldingPeriod} years</p>
                </div>
              </div>

              {/* Due Diligence Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Due Diligence</span>
                  <span className="text-sm text-white">
                    {Object.values(investment.dueDiligence).filter(Boolean).length}/
                    {Object.keys(investment.dueDiligence).length}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(Object.values(investment.dueDiligence).filter(Boolean).length / 
                        Object.keys(investment.dueDiligence).length) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* Risk Factors */}
              <div className="flex flex-wrap gap-2">
                {investment.keyRiskFactors.slice(0, 3).map((risk, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-400"
                  >
                    {risk}
                  </span>
                ))}
                {investment.keyRiskFactors.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-400">
                    +{investment.keyRiskFactors.length - 3} more
                  </span>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex gap-3 pt-4">
                <Link
                  href={`/pitching/investments/${investment._id}`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  Review Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvestments.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No investment requests found</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading investments...</p>
        </div>
      )}
    </div>
  );
}
