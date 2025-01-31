"use client";
import { FiX } from "react-icons/fi";
import {
  FaChartPie,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaHome,
  FaTags,
  FaStar,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { icon: FaChartPie, label: "Dashboard", href: "/admin" },
  { icon: FaClipboardList, label: "Pitch Review", href: "/admin/pitches" },
  { icon: FaTags, label: "Categories", href: "/admin/categories" },
  { icon: FaStar, label: "Featured Pitches", href: "/admin/featured" },
  { icon: FaUsers, label: "User Management", href: "/admin/users" },
  { icon: FaCog, label: "Settings", href: "/admin/settings" },
  { icon: FaHome, label: "Back to Home", href: "/" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`absolute lg:relative left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } ${!isOpen && "hidden lg:block"}`}
        animate={{ x: isOpen ? 0 : -16 }}
        initial={false}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <AnimatePresence>
              {isOpen && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-gray-800 dark:text-white"
                >
                  Admin Panel
                </motion.h2>
              )}
            </AnimatePresence>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`flex items-center px-4 py-3 mb-1 mx-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${!isOpen && "mx-auto"}`} />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </>
  );
}
