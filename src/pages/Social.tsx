
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityFeed from "@/components/social/ActivityFeed";
import FriendsList from "@/components/social/FriendsList";
import CommunityTemplates from "@/components/social/CommunityTemplates";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Social: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('activity');
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Social</h1>
            <p className="text-muted-foreground">
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
            <Button>Find Friends</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit">
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="templates">Community Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <ActivityFeed />
          </TabsContent>
          
          <TabsContent value="friends">
            <FriendsList searchQuery={searchQuery} initialTab={location.search.includes('requests') ? 'requests' : 'friends'} />
          </TabsContent>
          
          <TabsContent value="templates">
            <CommunityTemplates searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Social;
