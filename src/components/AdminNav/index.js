"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Building,
  CircleDollarSign,
  FileText,
  Flag,
  Menu,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Investments",
    href: "/admin/investments",
    icon: CircleDollarSign,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Compliance",
    href: "/admin/compliance",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px]">
          <div className="px-1 py-6">
            <div className="flex items-center gap-2 px-4 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
              <div className="space-y-1 p-2">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === item.href ? "bg-accent" : "transparent"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:block">
        <div className="flex items-center gap-2 px-4 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
          <div className="space-y-1 p-2">
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </nav>
    </>
  );
}
