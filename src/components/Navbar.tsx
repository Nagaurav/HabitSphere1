
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Activity, 
  Bell, 
  Home,
  Users,
  Trophy,
  BarChart,
  Heart,
  ChevronDown,
  X,
  Menu,
  UserPlus,
  User,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

const Navbar = () => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = React.useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNotificationClick = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "You have no new notifications.",
    });
  };

  // Enhanced function to handle account menu actions
  const handleAccountAction = (action: string) => {
    switch (action) {
      case "profile":
        toast({
          title: "Profile",
          description: "Navigating to your profile page.",
        });
        // Add actual navigation logic here
        break;
      case "settings":
        toast({
          title: "Settings",
          description: "Opening settings page.",
        });
        // Add actual navigation logic here
        break;
      case "help":
        toast({
          title: "Help Center",
          description: "Opening help and documentation.",
        });
        // Add actual navigation or modal logic here
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Add actual logout logic here
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const primaryNavItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/social", label: "Social", icon: Users },
  ];

  const secondaryNavItems = [
    { to: "/challenges", label: "Challenges", icon: Trophy },
    { to: "/digital-habits", label: "Digital Habits", icon: Activity },
    { to: "/analytics", label: "Analytics", icon: BarChart },
    { to: "/partnerships", label: "Partnerships", icon: Heart },
  ];

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

  // Mobile navbar is very simple
  if (isMobile) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Habit Sphere
            </span>
          </Link>

          <div className="flex items-center gap-2">
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAccountAction("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAccountAction("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAccountAction("help")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAccountAction("logout")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    );
  }

  // Desktop navbar
  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block hidden">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Habit Sphere
            </span>
          </Link>

          {!isMobile && (
            <div className="flex items-center space-x-1">
              {primaryNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
              ))}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1.5 py-2 px-3 rounded-md h-auto">
                    <span>More</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-1">
                  <div className="flex flex-col gap-1">
                    {secondaryNavItems.map((item) => (
                      <Link 
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex items-center gap-2 rounded-md p-2 text-sm transition-colors",
                          (pathname === item.to || pathname.startsWith(`${item.to}/`))
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground/70 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAccountAction("profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAccountAction("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAccountAction("help")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAccountAction("logout")}>
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
