'use client';
import { useEffect, useState } from 'react';
import { fetchPitcherDashboardDataAction } from '@/actions';
import PitchOverview from '@/components/dashboard/PitchOverview';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import InvestorInsights from '@/components/dashboard/InvestorInsights';
import FundingAnalytics from '@/components/dashboard/FundingAnalytics';
import InvestorEngagement from '@/components/dashboard/InvestorEngagement';
import { useUser } from '@clerk/nextjs';
import Loading from '@/app/loading';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InvestmentTrends from '@/components/dashboard/InvestmentTrends';
import InvestorDistribution from '@/components/dashboard/InvestorDistribution';
import RecentActivities from '@/components/dashboard/RecentActivities';
import UpcomingMilestones from '@/components/dashboard/UpcomingMilestones';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Calendar,
  LayoutGrid,
  List,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  Activity,
  Target,
  ArrowUpRight,
 
  
 
  
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { MdPending } from 'react-icons/md';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import Link from 'next/link';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PitcherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
console.log(dashboardData, "dashboard");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.id) {
        try {
          console.log("Fetching data for user:", user.id); // Debug log
          const data = await fetchPitcherDashboardDataAction(user.id);
          console.log("Received dashboard data:", data); // Debug log

          if (data.success) {
            setDashboardData(data);
          } else {
            console.error("Error in data:", data.error);
            setError(data.error || "Failed to fetch dashboard data");
          }
        } catch (error) {
          console.error("Error in loadDashboardData:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isLoaded && user) {
      loadDashboardData();
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Provide default values if dashboardData is null
  const defaultData = {
    stats: {},
    pitches: [],
    investmentTrends: {
      monthlyData: Array(12).fill(0),
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    investorDistribution: {
      distribution: [0, 0, 0, 0],
      labels: ['Angel Investors', 'VCs', 'Strategic', 'Others']
    },
    activities: [],
    upcomingMilestones: [],
    fundingAnalytics: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: Array(6).fill(0)
    }
  };

  const data = dashboardData || defaultData;
console.log(data?.pitches?.industry, "data");
  const stats = [
    {
      title: "Total Pitches",
      value: data?.stats?.totalPitches || "0",
      change: "↑ 0% vs last month",
      icon: <LayoutDashboard className="h-4 w-4" />,
      bgColor: "bg-blue-500"
    },
    {
      title: "Active Pitches",
      value: data?.stats?.activePitches || "0",
      change: "↑ 0% new this month",
      icon: <CheckCircle className="h-4 w-4" />,
      bgColor: "bg-violet-500"
    },
    {
      title: "Pending Pitches",
      value: data?.stats?.pendingPitches || "0",
      change: "0 pending pitches",
      icon: <MdPending className="h-4 w-4" />,
      bgColor: "bg-orange-500"
    },
    {
      title: "Total Views",
      value: data?.stats?.totalViews || "0",
      change: "this quarter",
      icon: <Eye className="h-4 w-4" />,
      bgColor: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Welcome Header - Full Width */}
 {/* Modern Glass-morphic Header */}
 <div className="backdrop-blur-md bg-[#1e293b]/30 border-b border-white/5 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Here's what's happening with your pitches today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 text-gray-300"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/5 rounded-full relative">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full">
                  <Settings className="h-5 w-5 text-gray-400" />
                </button>
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImageUrl}
                    alt="Profile"
                    className="h-9 w-9 rounded-full ring-2 ring-white/10"
                  />
                  <button className="p-1 hover:bg-white/5 rounded-full">
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Pitches",
              value: data.stats.totalPitches || 0,
              change: "+12.5%",
              icon: <Activity className="h-5 w-5 text-white" />,
              color: "bg-blue-500/20",
              barColor: "bg-blue-500",
              barHeight: "h-16"
            },
            {
              title: "Active Pitches",
              value: data.stats.activePitches || 0,
              change: "+8.2%",
              icon: <Target className="h-5 w-5 text-white" />,
              color: "bg-violet-500/20",
              barColor: "bg-violet-500",
              barHeight: "h-12"
            },
            {
              title: "Total Views",
              value: data.stats.totalViews || 0,
              change: "+15.3%",
              icon: <Eye className="h-5 w-5 text-white" />,
              color: "bg-emerald-500/20",
              barColor: "bg-emerald-500",
              barHeight: "h-14"
            },
            {
              title: "Interested Investors",
              value: data.stats.interestedInvestors || 0,
              change: "+5.4%",
              icon: <Users className="h-5 w-5 text-white" />,
              color: "bg-amber-500/20",
              barColor: "bg-amber-500",
              barHeight: "h-10"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-[#1e293b]/50 backdrop-blur-sm border border-white/5 p-4 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
              {/* Vertical bar on the right */}
              <div className="absolute right-0 top-0 bottom-0 w-1.5">
                <div className={`${stat.barColor} ${stat.barHeight} w-full rounded-full`} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-[#1e293b]/50 backdrop-blur-sm border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Investment Trends</h2>
              <div className="flex gap-2">
                {['Week', 'Month', 'Quarter', 'Year'].map((period) => (
                  <button
                    key={period}
                    className="px-3 py-1 text-sm rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <Line
                data={{
                  labels: data.investmentTrends?.labels || [],
                  datasets: [
                    {
                      label: 'Current Period',
                      data: data.investmentTrends?.monthlyData || [],
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: '#1e293b',
                      titleColor: '#fff',
                      bodyColor: '#94a3b8',
                      borderColor: '#ffffff10',
                      borderWidth: 1,
                      padding: 12,
                      displayColors: false
                    }
                  },
                  scales: {
                    y: {
                      grid: { color: '#ffffff05' },
                      ticks: { color: '#94a3b8' }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: '#94a3b8' }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#1e293b]/50 backdrop-blur-sm border border-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Investor Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={{
                  labels: data.investorDistribution?.labels || [],
                  datasets: [{
                    data: data.investorDistribution?.distribution || [],
                    backgroundColor: [
                      '#3b82f6',
                      '#8b5cf6',
                      '#10b981',
                      '#f59e0b'
                    ],
                    borderWidth: 0
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#94a3b8',
                        padding: 20,
                        font: { size: 12 }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-2xl bg-[#1e293b]/50 backdrop-blur-sm border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {(data.activities || []).slice(0, 4).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a]/50 border border-white/5 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{activity.title}</h3>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
    
        {/* Tabs - Full Width */}
        <Tabs defaultValue="overview" className="w-full space-y-4">
          <TabsList className="w-full flex bg-[#1e293b] p-1 text-gray-400 border border-gray-700 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="funding"
              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Funding
            </TabsTrigger>
            <TabsTrigger 
              value="investors"
              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Investors
            </TabsTrigger>
            <TabsTrigger 
              value="activities"
              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="investments"
              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Investments
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents - Full Width */}
          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1e293b] rounded-lg p-4 border border-gray-700"
              >
                <InvestmentTrends 
                  data={data?.investmentTrends}
                  timeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1e293b] rounded-lg p-4 border border-gray-700"
              >
                <InvestorDistribution data={data?.investorDistribution} />
              </motion.div>
            </div>

            <div className="bg-[#1e293b] rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Your Pitches</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedView('grid')}
                    className={`p-2 rounded ${selectedView === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedView('list')}
                    className={`p-2 rounded ${selectedView === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className={`grid ${selectedView === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-3`}>
                {data?.pitches?.map((pitch) => (
                  <PitchOverview key={pitch._id} pitch={pitch} viewType={selectedView} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funding" className="space-y-3">
            <FundingAnalytics analytics={data?.fundingAnalytics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvestmentTrends 
                data={data?.investmentTrends}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
              />
              <UpcomingMilestones milestones={data?.upcomingMilestones} />
            </div>
          </TabsContent>

          <TabsContent value="investors" className="space-y-3">
            <InvestorInsights insights={data?.investorInsights} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InvestorEngagement data={data?.investorEngagement} />
              <InvestorDistribution data={data?.investorDistribution} />
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivities activities={data?.activities} />
              </div>
              <div>
                <UpcomingMilestones milestones={data?.upcomingMilestones} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(data?.pitches || []).flatMap((pitch) => 
                (pitch.investments || []).map((investment) => (
                  <div
                    key={investment.investmentId}
                    className="group relative overflow-hidden rounded-xl bg-[#1e293b]/50 backdrop-blur-sm border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full 
                        ${investment.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 
                          investment.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 
                          'bg-red-500/20 text-red-500'}`}
                      >
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                      {investment.kycCompleted && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500">
                          KYC Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white truncate">
                          {pitch.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-400">
                            From {investment.investorProfile?.sectorExpertise || 'Anonymous Investor'}
                          </span>
                          {investment.investorProfile?.investmentExperience === 'expert' && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-500">
                              Expert Investor
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Amount</span>
                        <span className="text-lg font-semibold text-white">
                          {formatCurrency(investment.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Investment Type</span>
                        <span className="text-white capitalize">{investment.investmentType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Holding Period</span>
                        <span className="text-white">{investment.expectedHoldingPeriod} years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Submitted</span>
                        <span className="text-sm text-gray-400">
                          {new Date(investment.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Due Diligence Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Due Diligence Progress</span>
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

                    {/* Risk Factors Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
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

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setSelectedInvestment({ ...investment, pitchTitle: pitch.title })}
                        className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                      >
                        Quick View
                      </button>
                      <Link
                        href={`/pitching/investments/${investment.investmentId}`}
                        className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick View Modal */}
            <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
              <DialogContent className="bg-[#1e293b] border border-white/5 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Investment Request Details</DialogTitle>
                </DialogHeader>
                
                {selectedInvestment && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Investor</label>
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedInvestment.investorImage}
                            alt={selectedInvestment.investorName}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{selectedInvestment.investorName}</p>
                            <p className="text-sm text-gray-400">{selectedInvestment.investorType}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Investment Terms</label>
                        <div>
                          <p className="font-medium">{formatCurrency(selectedInvestment.amount)}</p>
                          <p className="text-sm text-gray-400">for {selectedInvestment.equity}% equity</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Pitch</label>
                      <p className="text-white font-medium">{selectedInvestment.pitchTitle}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Message</label>
                      <p className="text-gray-300">{selectedInvestment.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Investment Timeline</label>
                        <p className="font-medium">{selectedInvestment.timeline}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Due Diligence Status</label>
                        <p className="font-medium">{selectedInvestment.dueDiligenceStatus}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedInvestment(null)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 text-gray-400 hover:bg-white/10"
                      >
                        Close
                      </button>
                      <Link
                        href={`/pitching/investments/${selectedInvestment.pitchId}/${selectedInvestment.id}`}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
