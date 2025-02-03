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
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    <div className="flex min-h-screen bg-[#0f172a]">
      <div className={`
        fixed top-0 bottom-0 z-30
        ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}
        transition-transform duration-300
        w-20 lg:w-64 bg-[#1e293b]
      `}>
        {/* Sidebar content */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4">
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
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
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

          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-4 hover:bg-white/5"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`
        flex-1 
        ${isMobile ? 'ml-0' : 'ml-20 lg:ml-64'}
        transition-all duration-300
      `}>
        <header className="sticky top-0 z-20 h-16 bg-[#1e293b]/80 backdrop-blur-sm">
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
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
}
