import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Habit Builder</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/digital-habits"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/digital-habits"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Digital Habits
            </Link>
            <Link
              to="/analytics"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/analytics"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Analytics
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
