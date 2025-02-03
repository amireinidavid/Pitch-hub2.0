"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bell,
  Wallet,
  Send,
  FileText,
  Lightbulb,
  Users,
  Handshake,
  Network,
  LineChart,
  PieChart,
  Globe,
  Plus,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const mainNavItems = [
  {
    category: "Overview",
    items: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/pitching/dashboard" },
      {
        icon: Bell,
        text: "Notifications",
        path: "/pitching/notifications",
        badge: "3",
      },
      {
        icon: Wallet,
        text: "My Wallet",
        path: "/pitching/wallet",
        badge: "New",
      },
    ],
  },
  {
    category: "Pitch Management",
    items: [
      {
        icon: Send,
        text: "My Pitches",
        path: "/pitching/library",
        subItems: [
          { text: "Active Pitches", path: "/pitching/library/active" },
          { text: "Draft Pitches", path: "/pitching/library/drafts" },
          { text: "Archived", path: "/pitching/library/archived" },
        ],
      },
      { icon: FileText, text: "Documents", path: "/pitching/documents" },
      { icon: Lightbulb, text: "Pitch Ideas", path: "/pitching/ideas" },
    ],
  },
  {
    category: "Investor Relations",
    items: [
      { icon: Users, text: "Find Investors", path: "/pitching/investors" },
      { icon: Handshake, text: "Partnerships", path: "/pitching/partnerships" },
      {
        icon: Network,
        text: "Network",
        path: "/pitching/network",
        subItems: [
          { text: "My Connections", path: "/pitching/network/connections" },
          { text: "Recommendations", path: "/pitching/network/recommendations" },
          { text: "Industry Events", path: "/pitching/network/events" },
        ],
      },
    ],
  },
  {
    category: "Analytics & Reports",
    items: [
      {
        icon: LineChart,
        text: "Analytics",
        path: "/pitching/analytics",
        subItems: [
          { text: "Performance", path: "/pitching/analytics/performance" },
          { text: "Investor Interest", path: "/pitching/analytics/interest" },
          { text: "Market Trends", path: "/pitching/analytics/trends" },
        ],
      },
      { icon: PieChart, text: "Reports", path: "/pitching/reports" },
      { icon: Globe, text: "Market Data", path: "/pitching/market-data" },
    ],
  },
];

const NavItem = ({ item, isCollapsed, isActive }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <div>
      <Link
        href={item.path}
        className={`
          group flex items-center gap-3 p-3 rounded-xl
          transition-all duration-200
          ${isActive ? 'bg-blue-500/10 text-blue-500' : 'hover:bg-slate-800/50'}
        `}
        onClick={() => item.subItems && setIsSubMenuOpen(!isSubMenuOpen)}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50">
          <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between">
            <span className={`text-sm font-medium ${isActive ? 'text-blue-500' : 'text-slate-300'}`}>
              {item.text}
            </span>
            {item.badge && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* SubMenu Items */}
      <AnimatePresence>
        {item.subItems && isSubMenuOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-12 mt-2 space-y-1"
          >
            {item.subItems.map((subItem, idx) => (
              <Link
                key={idx}
                href={subItem.path}
                className="block px-3 py-2 text-sm text-slate-400 hover:text-blue-500 rounded-lg"
              >
                {subItem.text}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PitchingSidebar({ isMobile, isCollapsed, onCollapse }) {
  const pathname = usePathname();

  return (
    <div className={`
      h-full bg-[#0A0F1C] flex flex-col border-r border-slate-800
      transition-all duration-300 ease-in-out
      ${isMobile ? 'w-full' : isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && <span className="text-xl font-bold text-white">PitchHub</span>}
          {isMobile && (
            <button
              onClick={() => onCollapse()}
              className="p-2 rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {mainNavItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-500 px-4 mb-2">
                {section.category}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  isActive={pathname === item.path}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <button
          onClick={onCollapse}
          className="absolute right-[-12px] top-4 bg-slate-800 rounded-full p-2
            hover:bg-blue-500 hover:text-white
            transition-all duration-300 border border-slate-700/50 shadow-lg"
        >
          {!isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
    </div>
  );
}
