"use client";
import { useState, useEffect } from "react";
import { fetchPendingPitchesAction, reviewPitchAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import PitchReviewCard from "@/components/admin/PitchReviewCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminPitchReview() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStatus, setCurrentStatus] = useState("pending");
  const { toast } = useToast();

  useEffect(() => {
    loadPitches();
  }, [currentStatus]);

  async function loadPitches() {
    try {
      setLoading(true);
      const result = await fetchPendingPitchesAction();

      console.log("Fetched pitches:", result);

      if (result.success && result.pitches) {
        setPitches(result.pitches);
      } else {
        throw new Error(result.error || "Failed to load pitches");
      }
    } catch (error) {
      console.error("Load pitches error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(pitchId, reviewData) {
    try {
      console.log("Reviewing pitch:", pitchId, reviewData);

      const result = await reviewPitchAction(pitchId, reviewData);
      if (result.success) {
        toast({
          title: "Success",
          description: `Pitch ${
            reviewData.status === "active"
              ? "approved"
              : reviewData.status === "rejected"
              ? "rejected"
              : "updated"
          } successfully`,
        });
        await loadPitches();
      } else {
        throw new Error(result.error || "Review failed");
      }
    } catch (error) {
      console.error("Review error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const filteredPitches = pitches.filter((pitch) => {
    const matchesSearch =
      (pitch.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (pitch.tagline?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = pitch.status === currentStatus;

    return matchesSearch && matchesStatus;
  });

  console.log("Filtered pitches:", filteredPitches);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pitch Review Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pitches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs
            value={currentStatus}
            onValueChange={setCurrentStatus}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="active">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredPitches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No pitches found matching your search"
              : `No ${currentStatus} pitches found`}
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {filteredPitches.map((pitch) => (
            <motion.div key={pitch._id} variants={item}>
              <PitchReviewCard
                pitch={pitch}
                onReview={(reviewData) => handleReview(pitch._id, reviewData)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
