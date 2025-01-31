"use client";
import { useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import {
  FiTrendingUp,
  FiUsers,
  FiMessageSquare,
  FiStar,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function PitcherDashboard() {
  const [timeframe, setTimeframe] = useState("month");

  // Sample data for charts
  const pitchPerformanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Pitch Success Rate",
        data: [65, 72, 68, 75, 82, 88],
        borderColor: "rgb(99, 102, 241)",
        tension: 0.4,
      },
    ],
  };

  const investorInterestData = {
    labels: ["Interested", "Reviewing", "Passed", "Negotiating"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgb(34, 197, 94)",
          "rgb(99, 102, 241)",
          "rgb(239, 68, 68)",
          "rgb(234, 179, 8)",
        ],
      },
    ],
  };

  const fundingProgressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Funding Secured ($)",
        data: [50000, 150000, 250000, 400000],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Pitcher Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, John! Here's your pitch performance
            </p>
          </div>
          <Button className="bg-gradient-to-r from-gradient-1 to-gradient-2">
            Create New Pitch
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Pitches",
              value: "24",
              icon: <FiBarChart2 />,
              change: "+12%",
            },
            {
              title: "Investor Views",
              value: "1,429",
              icon: <FiUsers />,
              change: "+8%",
            },
            {
              title: "Messages",
              value: "48",
              icon: <FiMessageSquare />,
              change: "+24%",
            },
            {
              title: "Average Rating",
              value: "4.8",
              icon: <FiStar />,
              change: "+0.3",
            },
          ].map((stat, index) => (
            <Card key={index} className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className="text-primary text-xl">{stat.icon}</div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-500">
                <FiTrendingUp className="mr-1" />
                {stat.change} this month
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Pitch Performance
            </h3>
            <Line
              data={pitchPerformanceData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                  },
                  x: {
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                  },
                },
                plugins: {
                  legend: {
                    labels: { color: "rgba(255, 255, 255, 0.7)" },
                  },
                },
              }}
            />
          </Card>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Investor Interest
            </h3>
            <div className="h-[300px] flex justify-center">
              <Doughnut
                data={investorInterestData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "rgba(255, 255, 255, 0.7)" },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        {/* Funding Progress */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              Funding Progress
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("week")}
                className={timeframe === "week" ? "bg-primary text-white" : ""}
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("month")}
                className={timeframe === "month" ? "bg-primary text-white" : ""}
              >
                Month
              </Button>
            </div>
          </div>
          <Bar
            data={fundingProgressData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: { color: "rgba(255, 255, 255, 0.7)" },
                },
                x: {
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: { color: "rgba(255, 255, 255, 0.7)" },
                },
              },
              plugins: {
                legend: {
                  labels: { color: "rgba(255, 255, 255, 0.7)" },
                },
              },
            }}
          />
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                event: "Investor viewed your pitch",
                time: "2 hours ago",
                type: "view",
              },
              {
                event: "New message from Sarah (Angel Investor)",
                time: "5 hours ago",
                type: "message",
              },
              {
                event: "Pitch presentation scheduled",
                time: "1 day ago",
                type: "schedule",
              },
              {
                event: "Funding milestone reached",
                time: "2 days ago",
                type: "funding",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-zinc-800/50"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {activity.type === "view" && <FiUsers />}
                  {activity.type === "message" && <FiMessageSquare />}
                  {activity.type === "schedule" && <FiCalendar />}
                  {activity.type === "funding" && <FiTrendingUp />}
                </div>
                <div>
                  <p className="text-white">{activity.event}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
