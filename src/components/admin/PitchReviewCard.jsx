"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function PitchReviewCard({ pitch, onReview }) {
  console.log(pitch, "PitchReviewCard rendered");
  // Debug log
  console.log("Pitch data received:", pitch);

  const [expandedSection, setExpandedSection] = useState("overview");
  const [reviewData, setReviewData] = useState({
    businessModel: { score: 0, feedback: "" },
    marketPotential: { score: 0, feedback: "" },
    teamCapability: { score: 0, feedback: "" },
    financialViability: { score: 0, feedback: "" },
    competitiveAdvantage: { score: 0, feedback: "" },
  });

  // Guard clause for missing pitch data
  if (!pitch) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No pitch data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        showReview: true,
        showButtons: ["reject", "moreInfo", "approve"],
        badge: "Pending Review",
        description: "This pitch is awaiting initial review",
      },
      under_review: {
        icon: AlertCircle,
        color: "bg-blue-500/10",
        border: "border-blue-500/20",
        showReview: true,
        showButtons: ["reject", "approve"],
        badge: "Under Review",
        description: "Additional information requested",
      },
      active: {
        icon: CheckCircle,
        color: "bg-green-500/10",
        border: "border-green-500/20",
        showReview: false,
        showButtons: ["reject", "archive"],
        badge: "Approved",
        description: "This pitch has been approved",
      },
      rejected: {
        icon: XCircle,
        color: "bg-red-500/10",
        border: "border-red-500/20",
        showReview: false,
        showButtons: ["reopen"],
        badge: "Rejected",
        description: "This pitch was rejected",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(pitch.status);
  const StatusIcon = statusConfig.icon;

  const sections = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <StatusIcon className={`w-6 h-6 ${getStatusColor(pitch.status)}`} />
            <h3 className="text-xl font-semibold flex-1">
              {pitch.title || "Untitled Pitch"}
            </h3>
            <Badge variant={getStatusVariant(pitch.status)}>
              {pitch.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-xl ${statusConfig.color} ${statusConfig.border} border`}
            >
              <h4 className="font-medium mb-2">Funding Details</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Goal: </span>
                  <span className="font-semibold">
                    ${(pitch?.financials?.fundingGoal || 0).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Stage: </span>
                  <span className="font-semibold capitalize">
                    {pitch?.companyDetails?.stage || "Not specified"}
                  </span>
                </p>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl ${statusConfig.color} ${statusConfig.border} border`}
            >
              <h4 className="font-medium mb-2">Company Details</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Name: </span>
                  <span className="font-semibold">
                    {pitch?.companyDetails?.name || "Not provided"}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Industry: </span>
                  <span className="font-semibold">
                    {pitch?.industry || "Not specified"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl ${statusConfig.color} ${statusConfig.border} border mt-6`}
          >
            <h4 className="font-medium mb-4">Pitch Details</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Problem Statement</p>
                <p className="text-sm text-muted-foreground">
                  {pitch?.executiveSummary?.problem || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Solution</p>
                <p className="text-sm text-muted-foreground">
                  {pitch?.executiveSummary?.solution || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (statusConfig.showReview) {
    sections.push({
      id: "scoring",
      title: "Review",
      content: (
        <div className="space-y-6">
          {Object.entries(reviewData).map(([criteria, data]) => (
            <div
              key={criteria}
              className={`p-6 rounded-xl ${statusConfig.color} ${statusConfig.border} border`}
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium capitalize">
                  {criteria.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <span className="text-sm font-semibold">{data.score}/100</span>
              </div>
              <Slider
                value={[data.score]}
                onValueChange={([value]) => handleScoreChange(criteria, value)}
                max={100}
                step={1}
                className="my-4"
              />
              <Textarea
                placeholder={`Provide feedback for ${criteria
                  .replace(/([A-Z])/g, " $1")
                  .trim()}`}
                value={data.feedback}
                onChange={(e) => handleFeedbackChange(criteria, e.target.value)}
                className="mt-2"
              />
            </div>
          ))}
        </div>
      ),
    });
  }

  const handleScoreChange = (criteria, value) => {
    setReviewData((prev) => ({
      ...prev,
      [criteria]: { ...prev[criteria], score: value },
    }));
  };

  const handleFeedbackChange = (criteria, feedback) => {
    setReviewData((prev) => ({
      ...prev,
      [criteria]: { ...prev[criteria], feedback },
    }));
  };

  return (
    <Card
      className={`w-full mx-auto ${statusConfig.color} border ${statusConfig.border}`}
    >
      <CardHeader className="border-b border-border/50">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <StatusIcon
                className={`w-6 h-6 ${getStatusColor(pitch.status)}`}
              />
              <h2 className="text-2xl font-bold">
                {pitch.title || "Untitled Pitch"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {statusConfig.description}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant={getStatusVariant(pitch.status)}>
              {statusConfig.badge}
            </Badge>
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={expandedSection === section.id ? "default" : "outline"}
                onClick={() => setExpandedSection(section.id)}
                className="transition-all duration-200"
              >
                {section.title}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={expandedSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {sections.find((s) => s.id === expandedSection)?.content}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      {statusConfig.showButtons.length > 0 && (
        <CardFooter
          className={`border-t ${statusConfig.border} ${statusConfig.color}`}
        >
          <div className="flex justify-between items-center w-full mt-3">
            <div className="flex gap-2">
              {statusConfig.showButtons.includes("reject") && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    onReview({
                      ...reviewData,
                      status: "rejected",
                      rejectionReason:
                        pitch.status === "active"
                          ? "Post-approval rejection"
                          : "Initial rejection",
                    })
                  }
                  className="hover:bg-red-600"
                >
                  {pitch.status === "active" ? "Revoke Approval" : "Reject"}
                </Button>
              )}
              {statusConfig.showButtons.includes("moreInfo") && (
                <Button
                  variant="outline"
                  onClick={() =>
                    onReview({ ...reviewData, status: "under_review" })
                  }
                  className="border-blue-500/20 hover:bg-blue-500/10"
                >
                  Request More Info
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {statusConfig.showButtons.includes("approve") && (
                <Button
                  variant="default"
                  onClick={() => onReview({ ...reviewData, status: "active" })}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90"
                >
                  Approve
                </Button>
              )}
              {statusConfig.showButtons.includes("reopen") && (
                <Button
                  variant="outline"
                  onClick={() => onReview({ ...reviewData, status: "pending" })}
                  className="border-yellow-500/20 hover:bg-yellow-500/10"
                >
                  Reopen Review
                </Button>
              )}
              {statusConfig.showButtons.includes("archive") && (
                <Button
                  variant="outline"
                  onClick={() =>
                    onReview({ ...reviewData, status: "archived" })
                  }
                  className="border-gray-500/20 hover:bg-gray-500/10"
                >
                  Archive
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      )}

      {pitch.statusTimestamps && (
        <div className="px-6 pb-4 text-sm text-muted-foreground">
          <div className="flex gap-4 items-center">
            <span>Status History:</span>
            {Object.entries(pitch.statusTimestamps).map(
              ([status, timestamp]) => (
                <div key={status} className="flex items-center gap-1">
                  <span className="capitalize">{status}</span>
                  <span>•</span>
                  <span>{new Date(timestamp).toLocaleDateString()}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function getStatusVariant(status) {
  const variants = {
    draft: "secondary",
    pending: "warning",
    active: "success",
    rejected: "destructive",
    under_review: "info",
    funded: "premium",
    archived: "outline",
  };
  return variants[status] || "default";
}

function getStatusColor(status) {
  const colors = {
    pending: "text-yellow-500",
    under_review: "text-blue-500",
    active: "text-green-500",
    rejected: "text-red-500",
    funded: "text-purple-500",
    archived: "text-gray-500",
  };
  return colors[status] || "text-gray-500";
}
