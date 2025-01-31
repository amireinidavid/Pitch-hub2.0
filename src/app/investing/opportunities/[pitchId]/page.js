"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchPitchDetailsAction,
  fetchPitchInvestmentMetricsAction,
} from "@/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvestmentModal from "@/components/InvestmentModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function PitchDetails() {
  const { pitchId } = useParams();
  const { user } = useUser();
  const [pitch, setPitch] = useState(null);
  const [investmentMetrics, setInvestmentMetrics] = useState(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  console.log(pitch, "pitch");

  // Add new states for financials and team data
  const [financials, setFinancials] = useState({
    revenue: {
      historical: [
        { year: 2021, amount: 250000 },
        { year: 2022, amount: 500000 },
        { year: 2023, amount: 1000000 },
      ],
      projected: [
        { year: 2024, amount: 2000000 },
        { year: 2025, amount: 4000000 },
        { year: 2026, amount: 8000000 },
      ],
    },
    expenses: {
      historical: [
        { year: 2021, amount: 300000 },
        { year: 2022, amount: 450000 },
        { year: 2023, amount: 800000 },
      ],
      projected: [
        { year: 2024, amount: 1500000 },
        { year: 2025, amount: 2800000 },
        { year: 2026, amount: 5000000 },
      ],
    },
    metrics: {
      burnRate: 75000,
      runway: "18 months",
      grossMargin: "65%",
      customerAcquisitionCost: 500,
      lifetimeValue: 2500,
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [pitchResult, metricsResult] = await Promise.all([
          fetchPitchDetailsAction(pitchId),
          fetchPitchInvestmentMetricsAction(pitchId),
        ]);

        if (pitchResult.success) setPitch(pitchResult.pitch);
        if (metricsResult.success) setInvestmentMetrics(metricsResult);
      } catch (error) {
        console.error("Error loading pitch details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pitchId]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-6">
        <LoadingState />
      </div>
    );
  }

  // Show error state if pitch is not found after loading
  if (!pitch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-6 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold mb-2">Pitch Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The pitch you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary/90"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Helper function to format traction data
  const formatTraction = (traction) => {
    if (!traction) return "No traction data";
    if (typeof traction === "array") {
      return (
        <div className="space-y-2">
          {traction.metrics && (
            <div>
              <strong>Metrics:</strong> {traction.metrics}
            </div>
          )}
          {traction.milestones && (
            <div>
              <strong>Milestones:</strong> {traction.milestones}
            </div>
          )}
          {traction.customers && (
            <div>
              <strong>Customers:</strong> {traction.customers}
            </div>
          )}
        </div>
      );
    }
    return traction.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6 backdrop-blur-sm bg-card/90 border-primary/10 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {pitch.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        {pitch.industry}
                      </Badge>
                      <Badge variant="outline" className="border-primary/20">
                        {pitch?.companyDetails?.stage}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setShowInvestModal(true)}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Invest Now
                  </Button>
                </div>

                {/* Funding Progress */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 mb-6 p-4 bg-card/50 rounded-lg border border-primary/10"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Raised: {formatCurrency(pitch?.financials?.fundingRaised)}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(pitch?.financials?.fundingGoal)}
                    </span>
                  </div>
                  <Progress
                    value={
                      (pitch?.financials?.fundingRaised /
                        pitch?.financials?.fundingGoal) *
                      100
                    }
                    className="h-2.5 bg-primary/20"
                  />
                  <div className="text-xs text-right text-muted-foreground">
                    {Math.round(
                      (pitch?.financials?.fundingRaised /
                        pitch?.financials?.fundingGoal) *
                        100
                    )}
                    % of goal
                  </div>
                </motion.div>

                {/* Investment Metrics */}
                {investmentMetrics && (
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  >
                    <MetricCard
                      icon={<Users className="h-5 w-5 text-primary" />}
                      title="Total Investors"
                      value={formatNumber(
                        investmentMetrics.metrics.totalInvestments
                      )}
                    />
                    <MetricCard
                      icon={<DollarSign className="h-5 w-5 text-primary" />}
                      title="Avg. Investment"
                      value={formatCurrency(
                        investmentMetrics.metrics.statuses[0]?.avgAmount || 0
                      )}
                    />
                    <MetricCard
                      icon={<TrendingUp className="h-5 w-5 text-primary" />}
                      title="Pending Investment"
                      value={formatCurrency(
                        investmentMetrics.metrics.statuses.find(
                          (s) => s.status === "pending"
                        )?.totalAmount || 0
                      )}
                    />
                  </motion.div>
                )}

                {/* Content Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-6"
                >
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-card/50">
                    {["overview", "financials", "team", "investors"].map(
                      (tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                        >
                          {tab}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>

                  {/* Tab Contents */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="overview" className="mt-6">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-8"
                        >
                          {/* Description Section */}
                          <motion.div
                            variants={itemVariants}
                            className="prose dark:prose-invert max-w-none"
                          >
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                              About the Project
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {pitch.description}
                            </p>
                          </motion.div>

                          {/* Problem & Solution */}
                          <motion.div
                            variants={itemVariants}
                            className="grid md:grid-cols-2 gap-6"
                          >
                            <Card className="p-6 bg-destructive/5 border-destructive/10 hover:border-destructive/20 transition-all duration-300">
                              <h4 className="text-lg font-semibold text-destructive mb-3">
                                Problem
                              </h4>
                              <p className="text-muted-foreground">
                                {pitch?.executiveSummary?.problem}
                              </p>
                            </Card>
                            <Card className="p-6 bg-primary/5 border-primary/10 hover:border-primary/20 transition-all duration-300">
                              <h4 className="text-lg font-semibold text-primary mb-3">
                                Solution
                              </h4>
                              <p className="text-muted-foreground">
                                {pitch?.executiveSummary?.solution}
                              </p>
                            </Card>
                          </motion.div>

                          {/* Traction & Metrics */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6 bg-card/50 backdrop-blur-sm">
                              <h4 className="text-lg font-semibold mb-4">
                                Traction & Metrics
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(pitch.metrics || {}).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="p-4 rounded-lg bg-background/50 border border-primary/10"
                                    >
                                      <p className="text-sm text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </p>
                                      <p className="text-2xl font-bold text-foreground">
                                        {formatNumber(value)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="financials" className="mt-6">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-8"
                        >
                          {/* Current vs Projected Overview */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6">
                              <h4 className="text-lg font-semibold mb-6">
                                Revenue & Expenses Overview
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Revenue Section */}
                                <div className="space-y-4">
                                  <h5 className="text-md font-medium text-muted-foreground">
                                    Revenue
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Current
                                      </p>
                                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        $
                                        {formatNumber(
                                          pitch?.financials?.revenue?.current
                                        )}
                                      </p>
                                    </Card>
                                    <Card className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/30">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Projected
                                      </p>
                                      <p className="text-2xl font-bold text-emerald-500">
                                        $
                                        {formatNumber(
                                          pitch?.financials?.revenue?.projected
                                        )}
                                      </p>
                                    </Card>
                                  </div>
                                </div>

                                {/* Expenses Section */}
                                <div className="space-y-4">
                                  <h5 className="text-md font-medium text-muted-foreground">
                                    Expenses
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Card className="p-4 bg-red-50/50 dark:bg-red-950/20 border-red-200/50">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Current
                                      </p>
                                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        $
                                        {formatNumber(
                                          pitch?.financials?.expenses?.current
                                        )}
                                      </p>
                                    </Card>
                                    <Card className="p-4 bg-red-50/30 dark:bg-red-950/10 border-red-200/30">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Projected
                                      </p>
                                      <p className="text-2xl font-bold text-red-500">
                                        $
                                        {formatNumber(
                                          pitch?.financials?.expenses?.projected
                                        )}
                                      </p>
                                    </Card>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>

                          {/* Funding Progress */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                  <h4 className="text-lg font-semibold">
                                    Funding Progress
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Valuation: $
                                    {formatNumber(pitch?.financials?.valuation)}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="mt-2 md:mt-0"
                                >
                                  {Math.round(
                                    (pitch?.financials?.fundingRaised /
                                      pitch?.financials?.fundingGoal) *
                                      100
                                  )}
                                  % Raised
                                </Badge>
                              </div>
                              <div className="space-y-4">
                                <Progress
                                  value={
                                    (pitch?.financials?.fundingRaised /
                                      pitch?.financials?.fundingGoal) *
                                    100
                                  }
                                  className="h-2"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Raised
                                    </p>
                                    <p className="text-xl font-semibold">
                                      $
                                      {formatNumber(
                                        pitch?.financials?.fundingRaised
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                      Goal
                                    </p>
                                    <p className="text-xl font-semibold">
                                      $
                                      {formatNumber(
                                        pitch?.financials?.fundingGoal
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>

                          {/* Financial Projections */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6">
                              <h4 className="text-lg font-semibold mb-6">
                                Financial Projections
                              </h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Year</TableHead>
                                      <TableHead>Revenue</TableHead>
                                      <TableHead>Expenses</TableHead>
                                      <TableHead>Profit</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pitch?.financials?.financialProjections?.map(
                                      (projection) => (
                                        <TableRow key={projection._id}>
                                          <TableCell className="font-medium">
                                            {projection.year}
                                          </TableCell>
                                          <TableCell className="text-emerald-600 dark:text-emerald-400">
                                            ${formatNumber(projection?.revenue)}
                                          </TableCell>
                                          <TableCell className="text-red-600 dark:text-red-400">
                                            $
                                            {formatNumber(projection?.expenses)}
                                          </TableCell>
                                          <TableCell className="font-semibold">
                                            ${formatNumber(projection?.profit)}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </Card>
                          </motion.div>

                          {/* Previous Funding Rounds */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6">
                              <h4 className="text-lg font-semibold mb-6">
                                Previous Funding Rounds
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pitch?.financials?.previousFunding?.map(
                                  (round) => (
                                    <Card
                                      key={round._id}
                                      className="p-4 hover:bg-accent/5 transition-all duration-300"
                                    >
                                      <div className="flex justify-between items-start mb-4">
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/5"
                                        >
                                          {round.round}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(
                                            parseInt(round.date)
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <p className="text-2xl font-bold mb-2">
                                        ${formatNumber(round.amount)}
                                      </p>
                                      {round.investors.length > 0 && (
                                        <div className="mt-2">
                                          <p className="text-sm text-muted-foreground mb-1">
                                            Investors
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {round.investors.map(
                                              (investor, idx) => (
                                                <Badge
                                                  key={idx}
                                                  variant="secondary"
                                                >
                                                  {investor}
                                                </Badge>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </Card>
                                  )
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="team" className="mt-6">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-6"
                        >
                          {pitch.team?.map((member, index) => (
                            <motion.div
                              key={member.id}
                              variants={itemVariants}
                              className="group"
                            >
                              <Card className="p-6 hover:bg-accent/5 transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <Avatar className="h-24 w-24 rounded-lg border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                                    <AvatarImage src={member.image} />
                                    <AvatarFallback className="text-lg">
                                      {member.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-lg font-semibold">
                                        {member.name}
                                      </h4>
                                      <Badge
                                        variant="outline"
                                        className="bg-primary/5"
                                      >
                                        {member.role}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground">
                                      {member.bio}
                                    </p>
                                    <div className="flex gap-4 pt-2">
                                      {member.socialLinks?.map((link) => (
                                        <a
                                          key={link.platform}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                          {/* Add social icons based on platform */}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="investors" className="mt-6">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-8"
                        >
                          {/* Investment Stats */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6 bg-card/50">
                              <h4 className="text-lg font-semibold mb-6">
                                Investment Statistics
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {investmentMetrics?.metrics.statuses.map(
                                  (status) => (
                                    <div
                                      key={status.status}
                                      className="p-4 rounded-lg bg-background/50 border border-primary/10"
                                    >
                                      <p className="text-sm text-muted-foreground capitalize">
                                        {status.status}
                                      </p>
                                      <p className="text-2xl font-bold">
                                        {formatCurrency(status.totalAmount)}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {status.count} investors
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </Card>
                          </motion.div>

                          {/* Top Investors Table */}
                          <motion.div variants={itemVariants}>
                            <Card className="p-6 overflow-hidden">
                              <h4 className="text-lg font-semibold mb-6">
                                Top Investors
                              </h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-accent/5">
                                      <TableHead>Investor</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Date</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {investmentMetrics?.topInvestments.map(
                                      (inv) => (
                                        <TableRow
                                          key={inv._id}
                                          className="hover:bg-accent/5 transition-colors"
                                        >
                                          <TableCell>
                                            <div className="flex items-center gap-3">
                                              <Avatar className="h-8 w-8 border border-primary/20">
                                                <AvatarImage
                                                  src={
                                                    inv.investorId.profileImage
                                                  }
                                                />
                                                <AvatarFallback>
                                                  {inv.investorId.name[0]}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span className="font-medium">
                                                {inv.investorId.name}
                                              </span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            {formatCurrency(inv.amount)}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              variant={
                                                inv.status === "completed"
                                                  ? "success"
                                                  : "default"
                                              }
                                              className="capitalize"
                                            >
                                              {inv.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-muted-foreground">
                                            {new Date(
                                              inv.submittedAt
                                            ).toLocaleDateString()}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </Card>
                          </motion.div>
                        </motion.div>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </Card>
            </motion.div>
          </div>

          {/* Investment Details Sidebar */}
          <motion.div variants={itemVariants} className="col-span-1">
            <Card className="p-6 sticky top-6 backdrop-blur-sm bg-card/90 border-primary/10 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Investment Details</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Funding Goal</span>
                  <span className="font-semibold">
                    ${(pitch?.financials?.fundingGoal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Raised So Far</span>
                  <span className="font-semibold">
                    ${(pitch?.financials?.fundingRaised || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Equity Offered</span>
                  <span className="font-semibold">
                    {pitch?.investmentTerms?.equityOffered}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-semibold">
                    $
                    {(
                      pitch?.investmentTerms?.minimumInvestment || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full" size="lg">
                  Schedule Call
                </Button>
              </div>

              {/* Current Investors */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Current Investors
                </h3>
                <div className="space-y-4">
                  {pitch?.investments?.map((investment) => (
                    <div
                      key={investment._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={investment?.investor?.profileImage} />
                          <AvatarFallback>
                            {investment?.investor?.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {investment?.investor?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {investment?.equity}% equity
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        ${investment?.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Investment Modal */}
      <InvestmentModal
        pitch={pitch}
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
      />
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-6" />
          <div className="space-y-4 mb-6">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-6 w-2/3" />
              </Card>
            ))}
          </div>
        </Card>
      </div>
      <div className="hidden md:block">
        <Card className="p-6">
          <Skeleton className="h-6 w-2/3 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, title, value }) {
  return (
    <Card className="p-4 bg-card/50 border-primary/10 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm text-muted-foreground">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}
