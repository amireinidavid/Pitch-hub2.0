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

function PitcherCard({ pitchItem, pitchApplications, isLoading }) {
  const [isHovered, setIsHovered] = useState(false);
console.log(pitchItem, "pitchItem");

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
    return (
      <Card className="relative overflow-hidden border-0 bg-white/5 backdrop-blur-lg shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-16 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
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
      <Link href={`/pitching/${pitchItem._id}`}>
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
                  className={`${getStatusColor(pitchItem.status)}`}
                >
                  {pitchItem.status?.charAt(0).toUpperCase() +
                    pitchItem.status?.slice(1)}
                </Badge>
              </motion.div>
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                <AvatarImage src={pitchItem.image} alt={pitchItem.title} />
                <AvatarFallback>
                  {pitchItem.title?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {pitchItem.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {pitchItem.tagline}
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
                    pitchApplications.filter(
                      (item) => item.pitchID === pitchItem?._id
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
                  {format(new Date(pitchItem.createdAt), "MMM d, yyyy")}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="h-4 w-4 text-primary" />
                <span>{pitchItem.industry || "Technology"}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <DollarSign className="h-4 w-4 text-primary" />
                <span>{pitchItem.fundingGoal || "Seed Round"}</span>
              </motion.div>
            </div>

            {/* Animated Tags */}
            <div className="flex flex-wrap gap-2">
              {pitchItem.tags?.slice(0, 3).map((tag, index) => (
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
