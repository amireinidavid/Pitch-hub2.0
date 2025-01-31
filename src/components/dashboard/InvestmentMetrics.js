export default function InvestmentMetrics({ metrics }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Total Investors"
          value={metrics?.totalInvestors}
          icon="👥"
        />
        <MetricCard
          title="Total Invested"
          value={formatCurrency(metrics?.totalInvested)}
          icon="💰"
        />
        <MetricCard
          title="Average Investment"
          value={formatCurrency(metrics?.averageInvestment)}
          icon="📊"
        />
        <MetricCard
          title="Remaining to Goal"
          value={formatCurrency(metrics?.remainingToGoal)}
          icon="🎯"
        />
      </div>
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-2">Funding Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${metrics?.percentageRaised || 0}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">
          {Math.round(metrics?.percentageRaised || 0)}% of goal
        </p>
      </div>
    </div>
  );
} 