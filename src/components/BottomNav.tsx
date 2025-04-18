
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Activity, Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const { pathname } = useLocation();

  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Activity, label: "Habits", path: "/digital-habits" },
    { icon: Users, label: "Social", path: "/social" },
    { icon: Trophy, label: "Goals", path: "/challenges" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center justify-around h-20">
        {tabs.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors",
              pathname === path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground active:text-primary"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 mb-1",
              pathname === path && "animate-pulse-scale"
            )} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
