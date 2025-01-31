import PitchingSidebar from "@/components/PitchSidebar";
import React from "react";

export default function PitchLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#0f172a]">
      <div className="w-20 lg:w-64 flex-shrink-0">
        <PitchingSidebar />
      </div>
      <div className="flex-1 pl-8 pr-6 py-6 overflow-y-auto custom-scrollbar">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
