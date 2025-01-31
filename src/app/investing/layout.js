import React from "react";
import InvestingSidebar from "@/components/InvestingSidebar";

export default function InvestingLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <div className="w-20 flex-none lg:w-64 relative">
        <InvestingSidebar />
      </div>
      <div className="flex-grow p-6 md:p-12 pb-4 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
