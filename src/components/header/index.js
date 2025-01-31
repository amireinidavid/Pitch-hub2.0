"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  FiPlay,
  FiDollarSign,
  FiStar,
  FiBook,
  FiTrendingUp,
  FiUsers,
  FiMessageCircle,
  FiFileText,
  FiSearch,
  FiBriefcase,
  FiBarChart,
  FiCalendar,
} from "react-icons/fi";
import { RiFileHistoryLine } from "react-icons/ri";

function Header({ user, profileInfo }) {
  // Navigation items for pitchers
  const pitcherNavigation = [
    {
      title: "Home",
      href: "/",
      show: profileInfo,
    },
    {
      title: "Features",
      href: "#",
      show: profileInfo?.role === "pitcher",
      items: [
        {
          title: "AI Analysis",
          href: "/features/ai-analysis",
          description: "Advanced AI tools to analyze and improve your pitch",
          icon: <FiStar className="w-6 h-6" />,
        },
        {
          title: "Investor Matching",
          href: "/features/investor-matching",
          description: "Smart matching algorithm to find the right investors",
          icon: <FiUsers className="w-6 h-6" />,
        },
        {
          title: "Performance Tracking",
          href: "/features/tracking",
          description: "Detailed analytics and performance metrics",
          icon: <FiTrendingUp className="w-6 h-6" />,
        },
      ],
    },
    {
      title: "Pitching",
      href: "#",
      show: profileInfo?.role === "pitcher",
      items: [
        {
          title: "Create Pitch",
          href: "/pitching/create",
          description: "Start crafting your perfect pitch",
          icon: <FiPlay className="w-6 h-6" />,
        },
        {
          title: "My Pitches",
          href: "/pitching/library",
          description: "View and manage your existing pitches",
          icon: <FiBook className="w-6 h-6" />,
        },
        {
          title: "Practice Pitches",
          href: "/pitching/practice",
          description: "Practice your pitches with AI",
          icon: <FiPlay className="w-6 h-6" />,
        },
        {
          title: "Pitch History",
          href: "/pitching/history",
          description: "View your pitch history",
          icon: <RiFileHistoryLine className="w-6 h-6" />,
        },
      ],
    },
  ];

  // Navigation items for investors
  const investorNavigation = [
    {
      title: "Deal Flow",
      href: "#",
      show: profileInfo?.role === "investor",
      items: [
        {
          title: "Browse Pitches",
          href: "/investor/browse",
          description: "Discover new investment opportunities",
          icon: <FiSearch className="w-6 h-6" />,
        },
        {
          title: "My Investments",
          href: "/investor/portfolio",
          description: "Manage your investment portfolio",
          icon: <FiBriefcase className="w-6 h-6" />,
        },
        {
          title: "Analytics",
          href: "/investor/analytics",
          description: "Investment performance and metrics",
          icon: <FiBarChart className="w-6 h-6" />,
        },
      ],
    },
    {
      title: "Meetings",
      href: "#",
      show: profileInfo?.role === "investor",
      items: [
        {
          title: "Schedule",
          href: "/investor/meetings",
          description: "Manage your pitch meetings",
          icon: <FiCalendar className="w-6 h-6" />,
        },
        {
          title: "Due Diligence",
          href: "/investor/due-diligence",
          description: "Review company documents and data",
          icon: <FiFileText className="w-6 h-6" />,
        },
      ],
    },
  ];

  // Common navigation items for all users
  const commonNavigation = [
    {
      title: "About",
      href: "/about",
      show: true,
    },
    {
      title: "Contact",
      href: "/contact",
      show: true,
    },
  ];

  // Combine navigation based on user role
  const navigationItems = [
    ...pitcherNavigation,
    ...investorNavigation,
    ...commonNavigation,
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Image
            src={"/assets/logo.png"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Link href="/" className="font-bold text-2xl">
            PitchHub
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <NavigationMenu className="hidden md:flex hover:bg-transparent">
            <NavigationMenuList>
              {navigationItems.map(
                (item) =>
                  item.show && (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger className="bg-transparent">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {item.items.map((subItem) => (
                                <ListItem
                                  key={subItem.title}
                                  title={subItem.title}
                                  href={subItem.href}
                                  icon={subItem.icon}
                                >
                                  {subItem.description}
                                </ListItem>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 bg-background/50 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/15 data-[active]:text-primary data-[state=open]:bg-primary/15 data-[state=open]:text-primary border border-transparent hover:border-primary/20 backdrop-blur-sm"
                            )}
                          >
                            {item.title}
                          </NavigationMenuLink>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </div>
    </header>
  );
}

// ListItem component for dropdown menus
const ListItem = ({ className, title, children, href, icon }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colorshover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-primary/15 data-[active]:text-primary data-[state=open]:bg-primary/15 data-[state=open]:text-primary border border-transparent hover:border-primary/20 backdrop-blur-sm",
            className
          )}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Header;
