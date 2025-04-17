
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, MessageSquare, UserPlus, UserMinus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  streak_days: number;
  habit_count: number;
  status: 'friend' | 'pending' | 'received';
}

interface FriendsListProps {
  searchQuery?: string;
  initialTab?: string;
}

const FriendsList: React.FC<FriendsListProps> = ({ searchQuery = '', initialTab = 'friends' }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      // In a real implementation, you would fetch from Supabase
      // For now, simulate with dummy data
      setTimeout(() => {
        // Mock friends
        setFriends([
          { id: '1', name: 'Jane Smith', streak_days: 15, habit_count: 5, status: 'friend' },
          { id: '2', name: 'Michael Johnson', streak_days: 8, habit_count: 3, status: 'friend' },
          { id: '3', name: 'Emily Wilson', streak_days: 22, habit_count: 7, status: 'friend' },
        ]);
        
        // Mock friend requests
        setRequests([
          { id: '4', name: 'David Brown', streak_days: 5, habit_count: 2, status: 'received' },
          { id: '5', name: 'Sarah Garcia', streak_days: 10, habit_count: 4, status: 'received' },
        ]);
        
        // Mock suggestions
        setSuggestions([
          { id: '6', name: 'Robert Martinez', streak_days: 12, habit_count: 6, status: 'pending' },
          { id: '7', name: 'Lisa Anderson', streak_days: 7, habit_count: 3, status: 'pending' },
          { id: '8', name: 'Thomas Wilson', streak_days: 9, habit_count: 5, status: 'pending' },
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching friends data:', error);
      toast({
        title: "Error fetching friends",
        description: "Please try again later",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleAddFriend = (friendId: string) => {
    // In a real implementation, you would send a friend request via Supabase
    toast({
      title: "Friend request sent",
      description: "They'll receive your request shortly",
    });
    
    // Update UI state
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === friendId 
        ? { ...suggestion, status: 'pending' } 
        : suggestion
    ));
  };

  const handleAcceptRequest = (friendId: string) => {
    // In a real implementation, you would update the friend request in Supabase
    const requestToAccept = requests.find(r => r.id === friendId);
    
    if (requestToAccept) {
      // Add to friends list
      setFriends([...friends, { ...requestToAccept, status: 'friend' }]);
      // Remove from requests
      setRequests(requests.filter(r => r.id !== friendId));
      
      toast({
        title: "Friend request accepted",
        description: "You are now friends",
      });
    }
  };

  const handleRejectRequest = (friendId: string) => {
    // In a real implementation, you would update the friend request in Supabase
    setRequests(requests.filter(r => r.id !== friendId));
    
    toast({
      title: "Friend request rejected",
    });
  };

  const handleRemoveFriend = (friendId: string) => {
    // In a real implementation, you would update the friendship in Supabase
    setFriends(friends.filter(f => f.id !== friendId));
    
    toast({
      title: "Friend removed",
      description: "This person is no longer your friend",
    });
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit mb-4">
        <TabsTrigger value="friends">
          Friends ({filteredFriends.length})
        </TabsTrigger>
        <TabsTrigger value="requests" className="relative">
          Requests
          {requests.length > 0 && (
            <Badge className="ml-1 bg-red-500">{requests.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="friends" className="mt-0">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
            <p className="text-muted-foreground">No friends found. Add some friends to see them here!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFriends.map((friend) => (
              <Card key={friend.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{friend.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span>{friend.streak_days} day streak</span>
                    </div>
                    <div>
                      {friend.habit_count} habits
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="requests" className="mt-0">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
            <p className="text-muted-foreground">No pending friend requests.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${request.name}`} />
                    <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Wants to connect</p>
                  </div>
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="suggestions" className="mt-0">
        {suggestions.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
            <p className="text-muted-foreground">No friend suggestions available right now.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={suggestion.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${suggestion.name}`} />
                    <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BarChart className="h-4 w-4" />
                      <span>{suggestion.streak_days} day streak</span>
                    </div>
                    <div>
                      {suggestion.habit_count} habits
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddFriend(suggestion.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Friend
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default FriendsList;
