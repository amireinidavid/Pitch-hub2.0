"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchPitchAnalyticsAction } from "@/actions";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    pitchStats: [],
    industryDistribution: [],
    stageDistribution: [],
    fundingTrends: [],
    reviewScores: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const data = await fetchPitchAnalyticsAction();
    if (data.success) {
      setAnalytics(data.analytics);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pitch Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pitch Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Pitch Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.pitchStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                fill="#8884d8"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Industry Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.industryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="industry" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funding Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Funding Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.fundingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Review Scores */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Average Review Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.reviewScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="criteria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
