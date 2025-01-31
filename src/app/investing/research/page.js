"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaSearch, FaIndustry, FaTrendUp, FaGlobe } from "react-icons/fa";

export default function MarketResearch() {
  const [activeTab, setActiveTab] = useState("trends");
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    // Fetch market data
    // This would be connected to your market data action
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Market Research</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search markets..."
            className="w-64"
            icon={<FaSearch />}
          />
          <Button>
            <FaIndustry className="mr-2" />
            Filter by Industry
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-[600px] grid-cols-3">
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Industry Growth Trends
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer>
                  <LineChart data={marketData?.trends}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tech"
                      stroke="#10b981"
                      name="Technology"
                    />
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="#3b82f6"
                      name="Healthcare"
                    />
                    <Line
                      type="monotone"
                      dataKey="finance"
                      stroke="#8b5cf6"
                      name="Finance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Investment Opportunities by Sector
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer>
                  <BarChart data={marketData?.opportunities}>
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#10b981"
                      name="Available Deals"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Market Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add market insight cards */}
            </div>
          </Card>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  );
}
