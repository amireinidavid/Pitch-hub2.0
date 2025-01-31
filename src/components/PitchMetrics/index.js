"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchPitchInvestmentMetricsAction } from "@/actions";

export default function PitchMetrics({ pitchId }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, [pitchId]);

  async function loadMetrics() {
    const result = await fetchPitchInvestmentMetricsAction(pitchId);
    if (result.success) {
      setMetrics(result.metrics);
    }
  }

  if (!metrics) return null;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Investment Metrics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-slate-600">Total Investors</p>
          <p className="text-2xl font-bold">{metrics.totalInvestments}</p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            ${metrics.totalAmount.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Average Investment</p>
          <p className="text-2xl font-bold">
            $
            {(
              metrics.totalAmount / metrics.totalInvestments || 0
            ).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-600">
            $
            {(
              metrics.statuses.find((s) => s.status === "pending")
                ?.totalAmount || 0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {metrics.topInvestments?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Top Investors</h4>
          <div className="space-y-2">
            {metrics.topInvestments.map((inv) => (
              <div key={inv._id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {inv.investorId.profileImage && (
                    <img
                      src={inv.investorId.profileImage}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{inv.investorId.name}</span>
                </div>
                <span className="font-medium">
                  ${inv.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
