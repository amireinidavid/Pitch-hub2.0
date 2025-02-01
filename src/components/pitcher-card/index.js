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
  Building2,
  Globe,
  ChartBar,
  Users2,
  Award,
  Tag
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

function PitcherCard({ profileInfo, pitchItem, pitchApplications, viewMode }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // If we have a pitchItem, show the pitch card
  if (pitchItem) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full"
      >
        <Card className="relative h-full overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={`
              px-3 py-1 text-sm font-medium rounded-full
              ${pitchItem.status === 'active' ? 'bg-green-500/10 text-green-500' :
                pitchItem.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                pitchItem.status === 'draft' ? 'bg-gray-500/10 text-gray-500' :
                'bg-red-500/10 text-red-500'}
            `}>
              {pitchItem.status.charAt(0).toUpperCase() + pitchItem.status.slice(1)}
            </Badge>
          </div>

          {/* Company Logo/Image */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {pitchItem.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {pitchItem.tagline}
              </p>
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2">
              {pitchItem.industry && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {pitchItem.industry}
                </Badge>
              )}
              {pitchItem.companyDetails?.stage && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {pitchItem.companyDetails.stage}
                </Badge>
              )}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Funding Goal</span>
                </div>
                <p className="text-lg font-bold">
                  ${(pitchItem?.financials?.fundingGoal || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Investors</span>
                </div>
                <p className="text-lg font-bold">
                  {pitchItem.investments?.length || 0}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-lg font-bold">
                  {pitchItem.companyDetails?.location?.city || 'N/A'}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Team Size</span>
                </div>
                <p className="text-lg font-bold">
                  {pitchItem.companyDetails?.employeeCount || 0} members
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Link href={`/pitching/pitch/${pitchItem._id}`} className="flex-1">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created {format(new Date(pitchItem.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {pitchItem.status === 'active' ? 'Live' : 'In Review'}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Empty State with Animation
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-lg shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles className="h-20 w-20 text-primary mx-auto" />
            </motion.div>
          </div>
        </motion.div>
        
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          Create Your First Pitch
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
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

        {/* Decorative Elements */}
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

export default PitcherCard;
