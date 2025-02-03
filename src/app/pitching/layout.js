import PitchingSidebar from "@/components/PitchSidebar";
import React, { useState, useEffect } from "react";

export default function PitchLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <div className={`
        fixed top-0 bottom-0 z-30
        ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}
        transition-transform duration-300
        w-20 lg:w-64 bg-[#1e293b]
      `}>
        <PitchingSidebar 
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className={`
        flex-1 
        ${isMobile ? 'ml-0' : 'ml-20 lg:ml-64'}
        transition-all duration-300
      `}>
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
}
