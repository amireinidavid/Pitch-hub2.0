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
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/pitching/${pitchList[0]._id}`}>
        <Card className="relative overflow-hidden border-0 bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Sparkle Effects */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <Sparkles className="absolute top-2 right-2 h-4 w-4 text-primary animate-pulse" />
                <Sparkles className="absolute bottom-2 left-2 h-4 w-4 text-primary animate-pulse delay-100" />
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge
                  variant="outline"
                  className={`${getStatusColor(pitchList[0].status)}`}
                >
                  {pitchList[0].status?.charAt(0).toUpperCase() +
                    pitchList[0].status?.slice(1)}
                </Badge>
              </motion.div>
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                <AvatarImage src={pitchList[0].image} alt={pitchList[0].title} />
                <AvatarFallback>
                  {pitchList[0].title?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {pitchList[0].title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {pitchList[0].tagline}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {
                    pitchList.filter(
                      (item) => item.pitchID === pitchList[0]?._id
                    ).length
                  }{" "}
                  Investors
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {format(new Date(pitchList[0].createdAt), "MMM d, yyyy")}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="h-4 w-4 text-primary" />
                <span>{pitchList[0].industry || "Technology"}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <DollarSign className="h-4 w-4 text-primary" />
                <span>{pitchList[0].fundingGoal || "Seed Round"}</span>
              </motion.div>
            </div>

            {/* Animated Tags */}
            <div className="flex flex-wrap gap-2">
              {pitchList[0].tags?.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 hover:bg-primary/20 transition-colors duration-300"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full group relative overflow-hidden"
              variant="default"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                View Details
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

export default PitcherCard;
