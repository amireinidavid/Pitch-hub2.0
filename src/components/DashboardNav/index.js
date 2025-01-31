"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  CircleDollarSign,
  FileText,
  Home,
  MessagesSquare,
  PieChart,
  Settings,
  Users,
  Wallet,
  Calendar,
  UserPlus,
  TrendingUp,
  Globe,
  Shield,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const mainNavItems = [
  {
    title: "Overview",
    href: "/investing/dashboard",
    icon: Home,
  },
  {
    title: "Investments",
    href: "/investing/investments",
    icon: CircleDollarSign,
  },
  {
    title: "Opportunities",
    href: "/investing/opportunities",
    icon: Briefcase,
  },
  {
    title: "Portfolio",
    href: "/investing/portfolio",
    icon: PieChart,
  },
];

const quickActions = [
  {
    title: "New Investment",
    href: "/investing/new",
    icon: Wallet,
  },
  {
    title: "Schedule Meeting",
    href: "/investing/schedule",
    icon: Calendar,
  },
  {
    title: "Invite Friend",
    href: "/investing/invite",
    icon: UserPlus,
  },
];

const resourcesItems = [
  {
    title: "Market Trends",
    href: "/investing/trends",
    icon: TrendingUp,
    badge: "New",
  },
  {
    title: "Global Markets",
    href: "/investing/global",
    icon: Globe,
  },
  {
    title: "Learning Center",
    href: "/investing/learn",
    icon: BookOpen,
  },
  {
    title: "Help & Support",
    href: "/investing/support",
    icon: HelpCircle,
  },
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/investing/settings",
    icon: Settings,
  },
  {
    title: "Messages",
    href: "/investing/messages",
    icon: MessagesSquare,
  },
];

export function DashboardNav() {
  const path = usePathname();

  const NavItem = ({ item }) => (
    <Link href={item.href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex items-center rounded-xl p-2",
          "cursor-pointer transition-all duration-300",
          path === item.href
            ? "bg-gradient-to-r from-primary/20 to-primary/10 shadow-lg border border-primary/20"
            : "hover:bg-slate-800/50"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-700/50 border border-slate-700/50 shadow-inner">
          <item.icon className="h-4 w-4 text-slate-400" />
        </div>
        <span className="ml-3 text-sm font-medium text-slate-200">
          {item.title}
        </span>
      </motion.div>
    </Link>
  );

  return (
    <nav className="h-screen w-[280px] bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800">
      <div className="flex h-[60px] items-center justify-between px-4 border-b border-slate-800">
        <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Invest Hub
        </span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Main
            </h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resources
            </h3>
            <div className="space-y-1">
              {resourcesItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-slate-800 p-3">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
}
