
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui";
import { 
  LogOut, 
  Home, 
  Activity, 
  BarChart, 
  Users, 
  Trophy, 
  UserPlus, 
  Heart, 
  Bell, 
  User, 
  Settings,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    // Implement logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "You have no new notifications.",
    });
  };

  const NavLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) => (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 py-2 px-3 rounded-md transition-colors",
        (pathname === to || pathname.startsWith(`${to}/`))
          ? "bg-primary/10 text-primary font-medium" 
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      )}
      onClick={() => setMobileMenuOpen(false)}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Habit Builder
            </span>
          </Link>

          {!isMobile && (
            <div className="flex items-center space-x-1">
              <NavLink to="/" label="Dashboard" icon={Home} />
              <NavLink to="/social" label="Social" icon={Users} />
              <NavLink to="/challenges" label="Challenges" icon={Trophy} />
              <NavLink to="/digital-habits" label="Digital Habits" icon={Activity} />
              <NavLink to="/analytics" label="Analytics" icon={BarChart} />
              <NavLink to="/partnerships" label="Partnerships" icon={Heart} />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isMobile ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              {mobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 z-50 animate-fade-in">
                  <div className="flex flex-col space-y-1">
                    <NavLink to="/" label="Dashboard" icon={Home} />
                    <NavLink to="/social" label="Social" icon={Users} />
                    <NavLink to="/challenges" label="Challenges" icon={Trophy} />
                    <NavLink to="/digital-habits" label="Digital Habits" icon={Activity} />
                    <NavLink to="/analytics" label="Analytics" icon={BarChart} />
                    <NavLink to="/partnerships" label="Partnerships" icon={Heart} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/social?tab=requests">
                <Button variant="ghost" size="icon" className="relative">
                  <UserPlus className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    3
                  </span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
