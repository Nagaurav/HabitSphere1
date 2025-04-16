
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Activity, BarChart } from "lucide-react";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    // Implement logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Habit Builder</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-foreground/80",
                pathname === "/" 
                  ? "text-foreground font-semibold" 
                  : "text-foreground/60"
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/digital-habits"
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-foreground/80",
                pathname === "/digital-habits"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              )}
            >
              <Activity className="h-4 w-4" />
              Digital Habits
            </Link>
            <Link
              to="/analytics"
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-foreground/80",
                pathname === "/analytics"
                  ? "text-foreground font-semibold"
                  : "text-foreground/60"
              )}
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
