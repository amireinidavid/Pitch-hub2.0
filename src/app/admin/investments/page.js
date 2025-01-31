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
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { toast } = useToast();
console.log(investments, "Investments");

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
    
    const result = await adminReviewInvestmentAction(selectedInvestment._id, {
      status,
      feedback
    });

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
        description: "Failed to get investment",
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
        <DialogContent className="bg-[#1e293b] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>Review Investment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add feedback for the investor..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              className="border-red-500/20 hover:border-red-500/40 text-red-400"
              onClick={() => handleReview('rejected')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleReview('approved')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
