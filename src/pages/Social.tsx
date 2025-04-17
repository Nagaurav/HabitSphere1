
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityFeed from "@/components/social/ActivityFeed";
import FriendsList from "@/components/social/FriendsList";
import CommunityTemplates from "@/components/social/CommunityTemplates";
import { Button } from "@/components/ui/button";
import { Search, Users, Activity, FileText, Bell, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Social: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('activity');
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle tab parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'requests') {
      setActiveTab('friends');
    } else if (tab === 'activity' || tab === 'friends' || tab === 'templates') {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/social${value !== 'activity' ? `?tab=${value}` : ''}`, { replace: true });
  };

  const handleFindFriends = () => {
    navigate("/social?tab=friends");
    toast({
      title: "Find Friends",
      description: "Explore potential connections based on similar habits and goals.",
    });
  };

  const getTabIcon = (tab: string) => {
    switch(tab) {
      case 'activity':
        return <Activity className="h-4 w-4 mr-2" />;
      case 'friends':
        return <Users className="h-4 w-4 mr-2" />;
      case 'templates':
        return <FileText className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Social Hub</h1>
              <p className="text-muted-foreground mt-1">
                Connect with friends, share your progress, and discover new habits
              </p>
            </div>
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1 md:flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search friends or habits..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleFindFriends} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Find Friends
              </Button>
              <Button variant="outline" size="icon" className="flex md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <TabsList className="w-full sm:w-auto justify-start bg-muted/50 p-1">
              <TabsTrigger value="activity" className="flex items-center">
                {getTabIcon('activity')}
                Activity Feed
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center">
                {getTabIcon('friends')}
                Friends
                {activeTab === 'friends' && notifications > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                    {notifications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                {getTabIcon('templates')}
                Community Templates
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-muted-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {notifications}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <TabsContent value="activity" className="animate-fade-in">
            <ActivityFeed />
          </TabsContent>
          
          <TabsContent value="friends" className="animate-fade-in">
            <FriendsList searchQuery={searchQuery} initialTab={location.search.includes('requests') ? 'requests' : 'friends'} />
          </TabsContent>
          
          <TabsContent value="templates" className="animate-fade-in">
            <CommunityTemplates searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Social;
