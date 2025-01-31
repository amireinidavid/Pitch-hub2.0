'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PieChart, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  Menu,
  X,
  DollarSign,
  MessageSquare,
  Bell,
  Search,
  TrendingUp,
  Briefcase,
  Target,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsCollapsed(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      href: '/admin/analytics',
    },
    {
      title: 'Pitches',
      icon: Briefcase,
      href: '/admin/pitches',
      badge: '12'
    },
    {
      title: 'Investments',
      icon: DollarSign,
      href: '/admin/investments',
      badge: '5'
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Campaigns',
      icon: Target,
      href: '/admin/campaigns',
    },
    {
      title: 'Schedule',
      icon: Calendar,
      href: '/admin/schedule',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "min-h-screen flex-shrink-0 transition-all duration-300",
          "bg-gradient-to-b from-[#1e293b] to-[#0f172a]",
          isCollapsed ? "w-20" : "w-72",
          "border-r border-white/5",
          "relative"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                PitchDeck
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="h-6 w-6 text-gray-400" />
            ) : (
              <X className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
                "hover:bg-white/5 group relative",
                pathname === item.href 
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300",
                "group-hover:scale-110"
              )} />
              {!isCollapsed && (
                <>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="absolute right-4 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-blue-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className={cn(
            "rounded-xl p-4 bg-white/5 backdrop-blur-sm",
            "border border-white/5",
            isCollapsed ? "text-center" : ""
          )}>
            {isCollapsed ? (
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                  <div>
                    <h4 className="text-white font-medium">John Doe</h4>
                    <p className="text-sm text-gray-400">Admin</p>
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#1e293b]/80 backdrop-blur-sm px-4">
          <div className="flex h-full items-center justify-between">
            {/* Search */}
            <div className="relative w-96 max-w-[50%]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full rounded-xl border border-white/5 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  3
                </span>
              </button>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
