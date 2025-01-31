"use client";
import { useEffect, useState } from "react";
import { getAdminDashboardData } from "@/actions";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart as PieChartIcon,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  Activity,
  TrendingDown,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { PendingInvestments } from '../components/PendingInvestments';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('This Month');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [salesFilter, setSalesFilter] = useState('All');
  const [trafficFilter, setTrafficFilter] = useState('All');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalInvestments: 0,
      totalFunding: 0,
      totalPitches: 0,
      conversionRate: 0,
    },
    analytics: {
      weeklyData: [],
      marketingData: [],
      trafficData: [],
      audienceData: []
    }
  });
  const { toast } = useToast();
  console.log(dashboardData, "Admin Data")
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  async function loadDashboardData() {
    try {
      const data = await getAdminDashboardData(dateRange);
      setDashboardData(data);
    } catch (error) {

      console.error("Dashboard data error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  }

  const statCards = [
    {
      title: "Total Investments",
      value: `$${dashboardData?.stats?.totalFunding?.toLocaleString()}`,
      change: "+12.5%",
      isPositive: true,
      icon: Wallet,
      subtitle: "vs. last month",
      color: "from-blue-600 to-blue-400"
    },
    {
      title: "Active Pitches",
      value: dashboardData?.stats?.activePitches?.toString(),
      change: "+32%",
      isPositive: true,
      icon: Briefcase,
      subtitle: "vs. last month",
      color: "from-emerald-600 to-emerald-400"
    },
    {
      title: "Total Users",
      value: dashboardData?.stats?.totalUsers?.toString(),
      change: "+18.7%",
      isPositive: true,
      icon: Users,
      subtitle: "vs. last month",
      color: "from-violet-600 to-violet-400"
    },
    {
      title: "Conversion Rate",
      value: `${dashboardData?.stats?.conversionRate}%`,
      change: "-2.3%",
      isPositive: false,
      icon: Activity,
      subtitle: "vs. last month",
      color: "from-amber-600 to-amber-400"
    },
  ];

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/5 hover:bg-white/5">
            <Globe className="mr-2 h-4 w-4" />
            Global View
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-400">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Advanced Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <TabsList className="relative grid grid-cols-4 h-[60px] bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl p-1 gap-1">
            {[
              { value: "overview", label: "Overview", icon: BarChart3 },
              { value: "pitches", label: "Pitches", icon: Briefcase },
              { value: "investments", label: "Investments", icon: DollarSign },
              { value: "users", label: "Users", icon: Users }
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative h-full rounded-xl transition-all duration-300 data-[state=active]:bg-white/10 hover:bg-white/5 group"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    "group-data-[state=active]:text-white text-white/60"
                  )} />
                  <span className={cn(
                    "font-medium transition-colors",
                    "group-data-[state=active]:text-white text-white/60"
                  )}>
                    {label}
                  </span>
                </div>
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-data-[state=active]:opacity-100"
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent 
            value="overview"
            className="relative mt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid gap-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="relative overflow-hidden bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-10 ${stat.color}" />
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <stat.icon className="h-8 w-8 text-white opacity-80" />
                          <div className={cn(
                            "flex items-center gap-1 text-sm",
                            stat.isPositive ? "text-green-400" : "text-red-400"
                          )}>
                            {stat.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            {stat.change}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                          <p className="text-sm text-white/60 mt-1">{stat.title}</p>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-white/40">
                          <Clock className="h-4 w-4 mr-1" />
                          {stat.subtitle}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Investment Trends */}
              <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                <CardHeader>
                  <CardTitle>Investment Trends</CardTitle>
                  <CardDescription>Weekly investment analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData?.analytics?.weeklyData}>
                      <defs>
                        <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis dataKey="date" stroke="#718096" />
                      <YAxis stroke="#718096" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid rgba(255,255,255,0.1)' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="funding" 
                        stroke="#3B82F6" 
                        fillOpacity={1}
                        fill="url(#investmentGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribution Charts */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>By role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Investors', value: dashboardData?.stats?.investors },
                              { name: 'Pitchers', value: dashboardData?.stats?.pitchers }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardHeader>
                    <CardTitle>Pitch Status</CardTitle>
                    <CardDescription>Current distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Active', value: dashboardData?.stats?.activePitches },
                              { name: 'Pending', value: dashboardData?.stats?.pendingPitches },
                              { name: 'Rejected', value: dashboardData?.stats?.rejectedPitches }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="pitches">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recent Activity */}
              <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                <CardHeader>
                  <CardTitle>Recent Pitches</CardTitle>
                  <CardDescription>Latest pitch submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.pitches?.slice(0, 5).map((pitch, index) => (
                      <motion.div
                        key={pitch._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${COLORS[index % COLORS.length]} bg-opacity-10`}>
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{pitch.title}</h4>
                            <p className="text-sm text-gray-400">{pitch.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            pitch.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            pitch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {pitch.status}
                          </span>
                          <span className="text-sm text-gray-400">
                            {new Date(pitch.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="investments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Investment Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Total Investment</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          ${dashboardData?.stats?.totalFunding?.toLocaleString()}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-white/5 rounded-full">
                        <div className="h-full w-[75%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                      </div>
                      <p className="text-sm text-white/40 mt-2">75% of target reached</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Active Investments</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {dashboardData?.stats?.totalInvestments || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">12% increase</span>
                      <span className="text-sm text-white/40">vs last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Average Investment</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          $57,800
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={40}>
                        <AreaChart data={dashboardData?.analytics?.weeklyData}>
                          <Area 
                            type="monotone" 
                            dataKey="funding" 
                            stroke="#8B5CF6" 
                            fill="#8B5CF6" 
                            fillOpacity={0.2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Investments Table */}
              <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                <CardHeader>
                  <CardTitle>Recent Investments</CardTitle>
                  <CardDescription>Latest investment activities across all pitches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.pitches?.investments?.map((pitch, index) => (
                      <motion.div
                        key={pitch?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{pitch?.title}</h4>
                            <p className="text-sm text-white/60">{pitch?.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-white font-medium">
                              ${pitch.fundingDetails?.currentRound?.currentAmount?.toLocaleString() || 0}
                            </p>
                            <p className="text-sm text-white/60">Investment Amount</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs",
                              pitch.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              pitch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            )}>
                              {pitch.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Total Users</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {dashboardData?.stats?.totalUsers || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Investors</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {dashboardData?.stats?.investors || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Pitchers</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {dashboardData?.stats?.pitchers || 0}
                        </h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">Active Now</p>
                        <h3 className="text-2xl font-bold text-white mt-1">24</h3>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Users Table */}
              <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.users?.map((user, index) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            user.role === 'investor' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            user.role === 'pitcher' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            'bg-gradient-to-br from-purple-500 to-purple-600'
                          )}>
                            {user.role === 'investor' ? (
                              <Wallet className="h-5 w-5 text-white" />
                            ) : user.role === 'pitcher' ? (
                              <Briefcase className="h-5 w-5 text-white" />
                            ) : (
                              <Users className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{user.name || 'Anonymous'}</h4>
                            <p className="text-sm text-white/60">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs",
                            user.role === 'investor' ? 'bg-green-500/20 text-green-400' :
                            user.role === 'pitcher' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          )}>
                            {user.role}
                          </span>
                          <span className="text-sm text-white/60">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

// Filter Dropdown Component
function FilterDropdown({ value, onChange, options, icon }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/5 bg-[#1e293b] px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon || <ChevronDown className="h-4 w-4" />}
      </div>
    </div>
  );
}
