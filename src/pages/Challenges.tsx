
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistance, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import CreateChallengeDialog from "@/components/social/CreateChallengeDialog";

interface Challenge {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  category?: string;
  creator_name?: string;
  participant_count: number;
  is_public: boolean;
  my_progress?: number;
  participants?: {
    id: string;
    name: string;
    avatar?: string;
    progress: number;
  }[];
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      // Use mock data for challenges with consistent participant arrays and progress
      setTimeout(() => {
        setChallenges([
          {
            id: '1',
            title: '30-Day Meditation Challenge',
            description: 'Meditate for at least 10 minutes every day for 30 days',
            start_date: '2025-04-01',
            end_date: '2025-04-30',
            category: 'mindfulness',
            creator_name: 'Michael Johnson',
            participant_count: 15,
            is_public: true,
            my_progress: 60,
            participants: [
              { id: '1', name: 'Jane', progress: 80 },
              { id: '2', name: 'Bob', progress: 70 },
              { id: '3', name: 'Alice', progress: 65 }
            ],
          },
          {
            id: '2',
            title: 'Reading Marathon',
            description: 'Read for 20 minutes every day for 2 weeks',
            start_date: '2025-04-10',
            end_date: '2025-04-24',
            category: 'learning',
            creator_name: 'Emily Wilson',
            participant_count: 8,
            is_public: false,
            my_progress: 40,
            participants: [
              { id: '4', name: 'David', progress: 50 },
              { id: '5', name: 'Sarah', progress: 45 },
              { id: '6', name: 'Mike', progress: 35 }
            ],
          },
          {
            id: '3',
            title: 'Fitness Bootcamp',
            description: 'Complete a workout every other day for a month',
            start_date: '2025-04-15',
            end_date: '2025-05-15',
            category: 'fitness',
            creator_name: 'Chris Trainer',
            participant_count: 23,
            is_public: true,
            my_progress: 20,
            participants: [
              { id: '7', name: 'Lisa', progress: 25 },
              { id: '8', name: 'John', progress: 30 },
              { id: '9', name: 'Kelly', progress: 22 }
            ],
          },
          {
            id: '4',
            title: 'Yoga for Beginners',
            description: 'Learn Yoga basics and practice daily',
            start_date: '2025-05-05',
            end_date: '2025-05-30',
            category: 'fitness',
            creator_name: 'Anna Smith',
            participant_count: 10,
            is_public: true,
            // User not joined, so no my_progress
            participants: [
              { id: '10', name: 'Eve', progress: 10 },
              { id: '11', name: 'Mark', progress: 15 }
            ],
          },
          {
            id: '5',
            title: '30-Day Writing Challenge',
            description: 'Write a journal entry or blog post daily',
            start_date: '2025-03-01',
            end_date: '2025-03-30',
            category: 'creativity',
            creator_name: 'Sam Writer',
            participant_count: 12,
            is_public: true,
            my_progress: 100,
            participants: [
              { id: '12', name: 'Nina', progress: 100 },
              { id: '13', name: 'Leo', progress: 99 }
            ],
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error fetching challenges",
        description: "Please try again later",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    toast({
      title: "Challenge joined",
      description: "You've successfully joined the challenge",
    });

    // Update the state to mark the challenge as joined
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, participant_count: challenge.participant_count + 1, my_progress: 0, participants: challenge.participants ?? [] }
        : challenge
    ));
  };

  const handleCreateChallenge = (challenge: Omit<Challenge, 'id' | 'participant_count' | 'creator_name' | 'participants' | 'my_progress'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: Date.now().toString(),
      participant_count: 1,
      creator_name: 'You',
      my_progress: 0,
      participants: [],
    };

    setChallenges([newChallenge, ...challenges]);

    toast({
      title: "Challenge created",
      description: "Your new challenge has been created",
    });

    setOpenCreateDialog(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-60" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="max-w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Filters for tabs:
  const now = new Date();

  // Active: started and not ended yet and joined (my_progress defined)
  const activeChallenges = challenges.filter(c =>
    new Date(c.start_date) <= now &&
    new Date(c.end_date) >= now &&
    c.my_progress !== undefined
  );

  // Upcoming: start date in future and user joined (my_progress defined)
  const upcomingChallenges = challenges.filter(c =>
    new Date(c.start_date) > now &&
    c.my_progress !== undefined
  );

  // Completed: end date in past and user joined
  const completedChallenges = challenges.filter(c =>
    new Date(c.end_date) < now &&
    c.my_progress !== undefined
  );

  // Discover: public challenges, not joined by user (my_progress undefined), end date in future
  const discoverChallenges = challenges.filter(c =>
    c.is_public &&
    new Date(c.end_date) >= now &&
    c.my_progress === undefined
  );

  return (
    <Layout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
            <p className="text-muted-foreground max-w-md">
              Join habit challenges with friends or the community
            </p>
          </div>
          <Button onClick={() => setOpenCreateDialog(true)} className="flex items-center px-4 sm:px-5">
            <Plus className="h-4 w-4 mr-1" />
            Create Challenge
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit mb-4 overflow-x-auto no-scrollbar">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
                <p className="text-muted-foreground">No active challenges yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => {}}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
                <p className="text-muted-foreground">No upcoming challenges yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => {}}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
                <p className="text-muted-foreground">No completed challenges yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => {}}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            {discoverChallenges.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
                <p className="text-muted-foreground">No challenges to discover at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {discoverChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => handleJoinChallenge(challenge.id)}
                    showJoinButton={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateChallengeDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onCreateChallenge={handleCreateChallenge}
      />
    </Layout>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: () => void;
  showJoinButton: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin, showJoinButton }) => {
  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{challenge.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              {challenge.category && (
                <Badge variant="outline" className="truncate max-w-xs lowercase">
                  {challenge.category}
                </Badge>
              )}
              <Badge variant="outline" className={challenge.is_public ? 'bg-green-500/10 lowercase' : 'bg-amber-500/10 lowercase'}>
                {challenge.is_public ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground mb-3 break-words">{challenge.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {format(new Date(challenge.start_date), 'MMM d')} - {format(new Date(challenge.end_date), 'MMM d, yyyy')}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistance(new Date(challenge.start_date), new Date(), { addSuffix: true })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium truncate max-w-[10rem]">{challenge.creator_name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{challenge.participant_count} participants</div>
            </div>
          </div>
        </div>

        {challenge.my_progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your progress</span>
              <span>{challenge.my_progress}%</span>
            </div>
            <Progress value={challenge.my_progress} className="h-2" />
          </div>
        )}

        {challenge.participants && challenge.participants.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Leaderboard</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {challenge.participants
                .slice()
                .sort((a, b) => b.progress - a.progress)
                .map((participant, index) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <div className="w-5 text-sm text-muted-foreground">{index + 1}.</div>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm truncate">{participant.name}</div>
                    <div className="w-12 text-right text-sm">{participant.progress}%</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {showJoinButton ? (
          <Button className="w-full" onClick={onJoin}>
            Join Challenge
          </Button>
        ) : (
          <Button className="w-full" variant="outline">
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Challenges;

