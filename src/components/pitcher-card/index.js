"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Sparkles,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function PitcherCard({ pitchList, isLoading }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-200 text-gray-700",
      active: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800",
    pending: "bg-blue-100 text-blue-800",
    };
    return colors[status] || colors.draft;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!pitchList || pitchList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 bg-white/5 backdrop-blur-lg shadow-lg p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-4">Create Your First Pitch</h3>
          <p className="text-gray-400 mb-8">
            Start your journey by creating your first pitch. Share your vision and connect with potential investors.
          </p>

          <Link href="/pitching/create">
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Pitch
            </Button>
          </Link>

          {/* Decorative elements */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.2) 0%, transparent 70%)",
                "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {pitchList.map((pitch) => (
        <Card key={pitch._id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{pitch.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{pitch.tagline}</p>
              <div className="flex gap-2 mb-4">
                <Badge>{pitch.industry}</Badge>
                <Badge>{pitch.companyDetails?.stage}</Badge>
                <Badge className={getStatusColor(pitch.status)}>{pitch.status}</Badge>
              </div>
            </div>
            <Link href={`/pitching/pitch/${pitch._id}`}>
              <Button variant="outline" size="sm">
                View Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Goal: ${pitch.fundingGoal}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Created: {format(new Date(pitch.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Investors: {pitch.investments?.length || 0}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default PitcherCard;
