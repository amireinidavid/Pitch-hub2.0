"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaChartLine,
  FaWallet,
  FaBell,
  FaChartPie,
  FaHandshake,
  FaSearch,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLightbulb,
  FaGlobe,
  FaRocket,
  FaUserTie,
  FaCaretDown,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const investorNavItems = [
  {
    category: "Overview",
    items: [
      {
        icon: FaHome,
        text: "Dashboard",
        path: "/investing/dashboard",
        gradient: "from-purple-500 to-indigo-500",
      },
      {
        icon: FaBell,
        text: "Notifications",
        path: "/investing/notifications",
        badge: "3",
        gradient: "from-pink-500 to-rose-500",
      },
      {
        icon: FaWallet,
        text: "My Portfolio",
        path: "/investing/portfolio",
        gradient: "from-emerald-500 to-teal-500",
      },
    ],
  },
  {
    category: "Investments",
    items: [
      {
        icon: FaRocket,
        text: "Opportunities",
        path: "/investing/opportunities",
        gradient: "from-orange-500 to-amber-500",
        subItems: [
          { text: "Featured Deals", path: "/investing/opportunities/featured" },
          { text: "Trending", path: "/investing/opportunities/trending" },
          { text: "Saved", path: "/investing/opportunities/saved" },
        ],
      },
      {
        icon: FaHandshake,
        text: "Active Investments",
        path: "/investing/active",
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        icon: FaFileAlt,
        text: "Due Diligence",
        path: "/investing/due-diligence",
        gradient: "from-violet-500 to-purple-500",
      },
    ],
  },
  {
    category: "Analytics & Research",
    items: [
      {
        icon: FaChartPie,
        text: "Portfolio Analytics",
        path: "/investing/analytics",
        gradient: "from-green-500 to-emerald-500",
        subItems: [
          { text: "Performance", path: "/investing/analytics/performance" },
          { text: "Risk Analysis", path: "/investing/analytics/risk" },
          { text: "Returns", path: "/investing/analytics/returns" },
        ],
      },
      {
        icon: FaGlobe,
        text: "Market Research",
        path: "/investing/research",
        gradient: "from-red-500 to-pink-500",
      },
      {
        icon: FaLightbulb,
        text: "Insights",
        path: "/investing/insights",
        gradient: "from-yellow-500 to-amber-500",
      },
    ],
  },
];

export default function InvestingSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleExpand = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? "280px" : "80px",
      }}
      className={`
        sticky top-[64px] left-0 h-[calc(100vh-64px)]
        bg-gradient-to-b from-slate-900 to-slate-800
        text-white flex flex-col border-r border-slate-700/50
        transition-all duration-300 ease-in-out z-50
      `}
    >
      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700/50">
        <Link href="/investing/opportunities">
          <button
            className={`
            w-full h-12 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            hover:from-emerald-600 hover:to-teal-600
            transition-all duration-300 flex items-center justify-center gap-2
            font-medium shadow-lg hover:shadow-emerald-500/20
          `}
          >
            {isOpen ? (
              <>
                <FaSearch className="w-4 h-4" />
                <span>Discover Opportunities</span>
              </>
            ) : (
              <FaSearch className="w-5 h-5" />
            )}
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          {investorNavItems.map((section, idx) => (
            <div key={idx}>
              {isOpen && (
                <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                  {section.category}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.path}>
                    <Link
                      href={item.path}
                      className={`
                        group flex items-center gap-2 p-2 rounded-xl
                        transition-all duration-200
                        ${
                          pathname === item.path
                            ? `bg-gradient-to-r ${item.gradient} bg-opacity-10`
                            : "hover:bg-slate-700/30"
                        }
                      `}
                      onClick={() => item.subItems && toggleExpand(item.path)}
                    >
                      <div
                        className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        bg-gradient-to-r ${item.gradient}
                        transition-all duration-300 group-hover:scale-110
                      `}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>

                      {isOpen && (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-medium">{item.text}</span>
                          {item.badge && (
                            <span
                              className={`
                              px-2 py-1 text-xs rounded-full
                              bg-gradient-to-r ${item.gradient}
                            `}
                            >
                              {item.badge}
                            </span>
                          )}
                          {item.subItems && (
                            <FaCaretDown
                              className={`
                              transform transition-transform duration-200
                              ${expandedItems[item.path] ? "rotate-180" : ""}
                            `}
                            />
                          )}
                        </div>
                      )}
                    </Link>

                    {/* SubItems */}
                    <AnimatePresence>
                      {isOpen && item.subItems && expandedItems[item.path] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-12 mt-1 space-y-1"
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`
                                block py-2 px-3 rounded-lg text-sm
                                ${
                                  pathname === subItem.path
                                    ? "text-white bg-slate-700/30"
                                    : "text-slate-400 hover:text-white hover:bg-slate-700/20"
                                }
                                transition-all duration-200
                              `}
                            >
                              {subItem.text}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <Link
          href="/investing/settings"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/30 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center">
            <FaCog className="w-5 h-5" />
          </div>
          {isOpen && (
            <div>
              <div className="font-medium">Settings</div>
              <div className="text-xs text-slate-400">
                Customize your workspace
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-[-12px] top-4 bg-slate-800 rounded-full p-2
          hover:bg-emerald-500 hover:text-white
          transition-all duration-300 border border-slate-700/50 shadow-lg"
      >
        {isOpen ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
      </button>
    </motion.div>
  );
}
