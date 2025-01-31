"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  fetchInvestmentAnalyticsAction,
  fetchInvestorPortfolioAction,
  fetchInvestorInvestments,
} from "@/actions";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { FaChartLine, FaWallet, FaHandshake, FaChartPie } from "react-icons/fa";
import InvestmentStatus from "@/components/InvestmentStatus";

// Add this constant for the chart colors
const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
];

export default function InvestorDashboard() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    totalReturns: 0,
    portfolioDistribution: [], // Initialize with empty array
  });
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.id) {
        const [analyticsResult, portfolioResult] = await Promise.all([
          fetchInvestmentAnalyticsAction(user.id),
          fetchInvestorPortfolioAction(user.id),
        ]);

        if (analyticsResult.success) {
          setAnalytics(analyticsResult.analytics);
        }

        if (portfolioResult.success) {
          setPortfolio(portfolioResult.investments);
        }

        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    const result = await fetchInvestorInvestments();
    if (result.success) {
      setInvestments(result.investments);
    }
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Investment Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Invested"
          value={`$${(analytics?.totalInvested || 0).toLocaleString()}`}
          icon={FaWallet}
          color="emerald"
        />
        <MetricCard
          title="Active Investments"
          value={`${(analytics?.activeInvestments || 0).toLocaleString()}`}
          icon={FaHandshake}
          color="blue"
        />
        <MetricCard
          title="Total Returns"
          value={`$${(analytics?.totalReturns || 0).toLocaleString()}`}
          icon={FaChartLine}
          color="purple"
        />
        <MetricCard
          title="ROI"
          value={`${(calculateROI(analytics) || 0).toFixed(1)}%`}
          icon={FaChartPie}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={analytics?.portfolioDistribution || []}
                  dataKey="total"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                >
                  {(analytics?.portfolioDistribution || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Investment Timeline</h3>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={portfolio}>
                <XAxis dataKey="createdAt" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  fill="#10b98120"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Investments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Investments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Company</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.slice(0, 5).map((investment) => (
                <tr key={investment._id} className="border-b">
                  <td className="py-3">{investment.pitch?.title}</td>
                  <td className="py-3">
                    ${investment.amount.toLocaleString()}
                  </td>
                  <td className="py-3">{investment.investmentType}</td>
                  <td className="py-3">
                    <StatusBadge status={investment.status} />
                  </td>
                  <td className="py-3">
                    {new Date(investment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-4">My Investments</h3>
        <div className="space-y-6">
          {investments.map((investment) => (
            <InvestmentStatus key={investment._id} investment={investment} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-${color}-500/20 rounded-xl`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}

function calculateROI(analytics) {
  if (!analytics?.totalInvested || analytics.totalInvested === 0) return 0;
  return (
    ((analytics.totalReturns - analytics.totalInvested) /
      analytics.totalInvested) *
    100
  ).toFixed(2);
}
