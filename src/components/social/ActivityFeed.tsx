
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formatDistance } from "date-fns";
import { Input } from "@/components/ui/input";
import { getCategoryIcon } from "@/lib/habits";

interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  content: string;
  privacy_level: 'private' | 'friends' | 'public';
  habit_id?: string;
  created_at: string;
  user_name?: string;
  habit_title?: string;
  habit_category?: string;
  likes: number;
  comments: ActivityComment[];
  liked_by_me: boolean;
}

interface ActivityComment {
  id: string;
  user_id: string;
  user_name?: string;
  comment_text: string;
  created_at: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // This is a placeholder. In a real implementation, you would fetch
      // activities from your Supabase database including activities from friends
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Simulate data processing - in real app, you'd join tables or make separate queries
      const processedActivities = data?.map(activity => ({
        ...activity,
        user_name: 'John Doe', // Placeholder - you would get from users table
        habit_title: activity.habit_id ? 'Read for 20 minutes' : undefined,
        habit_category: 'learning',
        likes: Math.floor(Math.random() * 10),
        comments: [],
        liked_by_me: false
      })) || [];

      setActivities(processedActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error fetching activities",
        description: "Please try again later",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleLike = async (activityId: string) => {
    // In a real implementation, you would add/remove a like in the database
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const newLikedState = !activity.liked_by_me;
        return {
          ...activity,
          likes: newLikedState ? activity.likes + 1 : activity.likes - 1,
          liked_by_me: newLikedState
        };
      }
      return activity;
    }));

    toast({
      title: "Success",
      description: "Activity interaction recorded",
    });
  };

  const handleAddComment = async (activityId: string) => {
    if (!newComment[activityId]?.trim()) return;

    // In a real implementation, you would add the comment to the database
    const commentText = newComment[activityId];
    
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          comments: [
            ...activity.comments,
            {
              id: Date.now().toString(),
              user_id: 'current-user-id',
              user_name: 'You',
              comment_text: commentText,
              created_at: new Date().toISOString()
            }
          ]
        };
      }
      return activity;
    }));

    setNewComment({
      ...newComment,
      [activityId]: ''
    });

    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    });
  };

  const toggleComments = (activityId: string) => {
    setShowComments({
      ...showComments,
      [activityId]: !showComments[activityId]
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
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
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
        <p className="text-muted-foreground">No activities found. Connect with friends to see their activities!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New activity form */}
      <Card>
        <CardContent className="pt-4">
          <Textarea 
            placeholder="Share your progress or thoughts..." 
            className="resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button>Post</Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity feed */}
      {activities.map((activity) => (
        <Card key={activity.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-start gap-4 p-4 pb-2">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.user_name}`} />
              <AvatarFallback>
                {activity.user_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{activity.user_name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistance(new Date(activity.created_at), new Date(), { addSuffix: true })}
                  </div>
                </div>
              </div>
              {activity.activity_type === 'completed_habit' && activity.habit_title && (
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <span className="mr-1">{getCategoryIcon(activity.habit_category as any)}</span>
                  <span>Completed <span className="font-medium text-foreground">{activity.habit_title}</span></span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm">{activity.content}</p>
          </CardContent>
          <CardFooter className="flex items-center p-4 pt-0 gap-2">
            <Button 
              variant={activity.liked_by_me ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => handleLike(activity.id)}
            >
              <Heart className="h-4 w-4" />
              <span>{activity.likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-1"
              onClick={() => toggleComments(activity.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{activity.comments.length}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </CardFooter>

          {/* Comments section */}
          {showComments[activity.id] && (
            <div className="border-t p-4">
              <div className="space-y-3 mb-3">
                {activity.comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.user_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-md p-2">
                        <p className="text-xs font-medium">{comment.user_name}</p>
                        <p className="text-xs">{comment.comment_text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment[activity.id] || ''}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    [activity.id]: e.target.value
                  })}
                  className="text-sm"
                />
                <Button size="sm" onClick={() => handleAddComment(activity.id)}>Post</Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;
