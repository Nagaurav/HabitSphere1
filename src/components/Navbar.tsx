
import React from "react";
import { Button } from "@/components/ui/button";
import { Flame, User, Settings, BarChart2 } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <header className="border-b border-border/40 py-4 bg-background/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-purple" />
          <span className="font-bold text-xl">HabitSphere</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            className="text-foreground hover:text-purple transition-colors font-medium"
          >
            Dashboard
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-purple transition-colors"
          >
            Habits
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-purple transition-colors"
          >
            Statistics
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-purple transition-colors"
          >
            Achievements
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
