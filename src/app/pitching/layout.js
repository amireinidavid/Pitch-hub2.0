"use client"
import PitchingSidebar from "@/components/PitchSidebar";
import React, { useState, useEffect } from "react";

export default function PitchLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto collapse on mobile, stay expanded on desktop
      setIsCollapsed(mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* Sidebar - Always visible on desktop, collapsible on mobile */}
      <div className={`
        fixed top-0 bottom-0 z-30
        ${isMobile ? 'w-[80px]' : 'w-64'}
        ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        transition-all duration-300
        bg-[#1e293b]
      `}>
        <PitchingSidebar 
          isMobile={isMobile}
          isCollapsed={isMobile}
          onCollapse={() => isMobile && setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className={`
        flex-1
        ${isMobile ? 'ml-[80px]' : 'ml-64'}
        ${isMobile && isCollapsed ? 'ml-0' : ''}
        transition-all duration-300
      `}>
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
}
