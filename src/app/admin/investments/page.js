"use client";
import { useState, useEffect } from "react";
import {
  fetchPendingInvestments,
  adminReviewInvestmentAction,
} from "@/actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  Briefcase,
  Building,
  CreditCard,
  FileText,
  GanttChartSquare,
  Goal,
  HandCoins,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  Scale,
  Shield,
  Target,
  Timer,
  TrendingUp,
  UserCheck,
  Wallet,
  Activity,
  Users
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
console.log(investments, "Investments");
const { toast } = useToast();

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    const result = await fetchPendingInvestments();
    if (result.success) {
      setInvestments(result.investments);
    }
  }

  async function handleReview(status) {
    if (!selectedInvestment) return;
    
    const result = await adminReviewInvestmentAction(
      selectedInvestment.pitchId._id,
      selectedInvestment._id,
      {
        status,
        feedback
      }
    );

    if (result.success) {
      toast({
        title: "Success! 🎉",
        description: (`Investment ${status === 'approved' ? 'approved' : 'rejected'} successfully`),
        variant: "success",
      })
      await loadInvestments();
      setIsReviewOpen(false);
      setSelectedInvestment(null);
      setFeedback("");
    } else {
      toast({
        title: "Error!",
        description: result.error || "Failed to review investment",
        variant: "error"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Reviews</h1>
          <p className="text-gray-400">Review and manage investment requests</p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          {investments.length} Pending Reviews
        </Badge>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {investments.map((investment, index) => (
            <motion.div
              key={investment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#1e293b]/50 backdrop-blur-sm border-white/5 hover:bg-[#1e293b]/70 transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-white">
                        {investment.pitchId.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{investment.investorId.name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                      {investment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Amount</span>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        ${investment.amount.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted</span>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {new Date(investment.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Type</span>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {investment.investmentType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-white/5 hover:border-white/10 hover:bg-white/5"
                      onClick={() => {
                        setSelectedInvestment(investment);
                        setIsReviewOpen(true);
                      }}
                    >
                      Review Investment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="bg-[#1e293b] border-white/5 text-white max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Investment Review</DialogTitle>
          </DialogHeader>
          
          {selectedInvestment && (
            <div className="space-y-6">
              {/* Investment Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Amount</span>
                  </div>
                  <p className="text-2xl font-bold">${selectedInvestment.amount.toLocaleString()}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Briefcase className="h-5 w-5" />
                    <span className="font-medium">Type</span>
                  </div>
                  <p className="text-2xl font-bold capitalize">{selectedInvestment.investmentType}</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <HandCoins className="h-5 w-5" />
                    <span className="font-medium">Structure</span>
                  </div>
                  <p className="text-2xl font-bold capitalize">{selectedInvestment.investmentStructure}</p>
                </div>
              </div>

              {/* Tabs for detailed information */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 bg-white/5 p-1 rounded-lg">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="thesis">Investment Thesis</TabsTrigger>
                  <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-orange-400">
                        <Timer className="h-5 w-5" />
                        <h3 className="font-medium">Holding Period</h3>
                      </div>
                      <p className="text-white/80">{selectedInvestment.expectedHoldingPeriod} years</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <TrendingUp className="h-5 w-5" />
                        <h3 className="font-medium">Exit Strategy</h3>
                      </div>
                      <p className="text-white/80 capitalize">{selectedInvestment.exitStrategy}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-pink-400">
                      <Lightbulb className="h-5 w-5" />
                      <h3 className="font-medium">Value Add Proposal</h3>
                    </div>
                    <p className="text-white/80">{selectedInvestment.valueAddProposal}</p>
                  </div>
                </TabsContent>

                <TabsContent value="thesis" className="mt-4 space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <FileText className="h-5 w-5" />
                      <h3 className="font-medium">Investment Thesis</h3>
                    </div>
                    <p className="text-white/80">{selectedInvestment.investmentThesis}</p>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="font-medium">Risk Tolerance</h3>
                      </div>
                      <p className="text-white/80 capitalize">{selectedInvestment.riskTolerance}</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Shield className="h-5 w-5" />
                        <h3 className="font-medium">Key Risk Factors</h3>
                      </div>
                      <ul className="list-disc list-inside text-white/80">
                        {selectedInvestment.keyRiskFactors?.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Scale className="h-5 w-5" />
                      <h3 className="font-medium">Mitigation Strategies</h3>
                    </div>
                    <p className="text-white/80">{selectedInvestment.mitigationStrategies}</p>
                  </div>
                </TabsContent>

                <TabsContent value="compliance" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-violet-400">
                        <UserCheck className="h-5 w-5" />
                        <h3 className="font-medium">KYC Status</h3>
                      </div>
                      <Badge variant={selectedInvestment.kycCompleted ? "success" : "warning"}>
                        {selectedInvestment.kycCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Lock className="h-5 w-5" />
                        <h3 className="font-medium">Accreditation</h3>
                      </div>
                      <Badge variant={selectedInvestment.accreditationVerified ? "success" : "warning"}>
                        {selectedInvestment.accreditationVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Admin Review Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="font-medium">Admin Feedback</h3>
                </div>
                <Textarea
                  placeholder="Provide detailed feedback for the investor..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 min-h-[120px]"
                />
              </div>

              {/* Action Buttons */}
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300"
                  onClick={() => handleReview('rejected')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Investment
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  onClick={() => handleReview('approved')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Investment
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
