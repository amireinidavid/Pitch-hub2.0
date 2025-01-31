"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  FaSearch,
  FaFilter,
  FaChartLine,
  FaIndustry,
  FaUsers,
  FaRegBookmark,
  FaBookmark,
  FaRegHeart,
  FaHeart,
  FaSpinner,
} from "react-icons/fa";
import { fetchInvestmentOpportunitiesAction } from "@/actions";

export default function InvestmentOpportunities() {
  const { user } = useUser();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    industry: "",
    fundingRange: "",
    stage: "",
    search: "",
  });
  const [savedPitches, setSavedPitches] = useState(new Set());
  const [likedPitches, setLikedPitches] = useState(new Set());

  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      const result = await fetchInvestmentOpportunitiesAction(filters);
      if (result.success) {
        setOpportunities(result.opportunities);
        setStats(result.stats);
      }
      setIsLoading(false);
    };
    loadOpportunities();
  }, [filters]);

  const toggleSave = (pitchId) => {
    setSavedPitches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pitchId)) {
        newSet.delete(pitchId);
      } else {
        newSet.add(pitchId);
      }
      return newSet;
    });
  };

  const toggleLike = (pitchId) => {
    setLikedPitches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pitchId)) {
        newSet.delete(pitchId);
      } else {
        newSet.add(pitchId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
              <div className="text-sm text-slate-400">
                Total Funding Required
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                ${(stats.totalFunding || 0).toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <div className="text-sm text-slate-400">
                Average Equity Offered
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {(stats.avgEquity || 0).toFixed(1)}%
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-rose-500/10">
              <div className="text-sm text-slate-400">Average Valuation</div>
              <div className="text-2xl font-bold text-purple-400">
                ${((stats.avgValuation || 0) / 1000000).toFixed(1)}M
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-8 items-center bg-slate-800/30 p-4 rounded-xl">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search opportunities..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="bg-slate-700/30"
            icon={<FaSearch className="text-slate-400" />}
          />
        </div>
        <Select
          value={filters.industry}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, industry: value }))
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-700/30">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="health">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.stage}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, stage: value }))
          }
        >
          <SelectTrigger className="w-[180px] bg-slate-700/30">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seed">Seed</SelectItem>
            <SelectItem value="early">Early Stage</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="expansion">Expansion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-emerald-500" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-lg text-slate-400">No opportunities found</div>
            <p className="text-sm text-slate-500 mt-2">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          opportunities.map((pitch) => (
            <motion.div
              key={pitch._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/investing/opportunities/${pitch._id}`}>
                <Card className="group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden">
                  {/* Card Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pitch.coverImage || "/default-pitch-cover.jpg"}
                      alt={pitch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {pitch.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {pitch.industry}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {pitch.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-slate-400 line-clamp-2">
                      {pitch.shortDescription}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">
                          Funding Goal
                        </span>
                        <span className="font-semibold text-emerald-400">
                          ${pitch.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">
                          Equity Offered
                        </span>
                        <span className="font-semibold text-blue-400">
                          {pitch.equity}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Raised</span>
                        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            style={{
                              width: `${
                                (pitch.raised / pitch.fundingGoal) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <FaChartLine className="text-emerald-400" />
                        <span className="text-sm text-slate-400">
                          {typeof pitch.traction === "object"
                            ? `${pitch.traction.metrics || 0}% Monthly Growth`
                            : `${pitch.traction || 0}% Monthly Growth`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSave(pitch._id);
                          }}
                          className="p-2 hover:bg-slate-700/30 rounded-full transition-colors"
                        >
                          {savedPitches.has(pitch._id) ? (
                            <FaBookmark className="text-emerald-400" />
                          ) : (
                            <FaRegBookmark className="text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(pitch._id);
                          }}
                          className="p-2 hover:bg-slate-700/30 rounded-full transition-colors"
                        >
                          {likedPitches.has(pitch._id) ? (
                            <FaHeart className="text-rose-400" />
                          ) : (
                            <FaRegHeart className="text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
