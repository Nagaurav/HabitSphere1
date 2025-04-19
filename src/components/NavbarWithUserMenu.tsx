
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarUserMenu from "./NavbarUserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, Home, BarChart3, Users, Trophy, Handshake, Settings, HelpCircle } from "lucide-react";

const NavbarWithUserMenu: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105 duration-200"
        >
          <div className="rounded-full bg-gradient-to-tr from-primary/80 to-purple-400/80 p-1.5 shadow-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className={cn(
            "font-bold text-xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent",
            isMobile ? "hidden" : "hidden sm:inline"
          )}>
            HabitSphere
          </span>
          <span className={cn(
            "font-bold text-xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent",
            isMobile ? "inline" : "sm:hidden"
          )}>
            HS
          </span>
        </Link>

        {!isMobile && (
          <nav className="flex items-center space-x-1 ml-4 mr-auto">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Home className="mr-1 h-4 w-4" /> Home
              </Button>
            </Link>
            <Link to="/analytics">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <BarChart3 className="mr-1 h-4 w-4" /> Analytics
              </Button>
            </Link>
            <Link to="/social">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Users className="mr-1 h-4 w-4" /> Social
              </Button>
            </Link>
            <Link to="/challenges">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Trophy className="mr-1 h-4 w-4" /> Challenges
              </Button>
            </Link>
            <Link to="/partnerships">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Handshake className="mr-1 h-4 w-4" /> Partnerships
              </Button>
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          {!isMobile && (
            <>
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
              <Link to="/help">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
              </Link>
            </>
          )}
          <NavbarUserMenu />
        </div>
      </div>
    </header>
  );
};

export default NavbarWithUserMenu;
