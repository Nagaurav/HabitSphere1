
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Users, Heart, RefreshCw, Check, X, Calendar, MessagesSquare } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'invited' | 'pending';
  joinedDate: string;
  lastCheckin?: string;
  streak: number;
  habitsFocusedOn: string[];
}

const Partnerships: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sarah',
      status: 'active',
      joinedDate: '2025-03-15',
      lastCheckin: '2025-04-16',
      streak: 21,
      habitsFocusedOn: ['Morning Meditation', 'Daily Exercise']
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael',
      status: 'active',
      joinedDate: '2025-03-22',
      lastCheckin: '2025-04-15',
      streak: 14,
      habitsFocusedOn: ['Reading', 'Journaling']
    },
    {
      id: '3',
      name: 'Alex Thompson',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex',
      status: 'invited',
      joinedDate: '2025-04-10',
      streak: 0,
      habitsFocusedOn: []
    },
    {
      id: '4',
      name: 'Jordan Taylor',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Jordan',
      status: 'pending',
      joinedDate: '2025-04-12',
      streak: 0,
      habitsFocusedOn: []
    }
  ]);

  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePartners = filteredPartners.filter(partner => partner.status === 'active');
  const pendingPartners = filteredPartners.filter(partner => partner.status === 'invited' || partner.status === 'pending');

  const handleSendInvite = () => {
    toast({
      title: "Invite Sent",
      description: "Your accountability partnership invitation has been sent.",
    });
  };

  const handleAcceptRequest = (partnerId: string) => {
    setPartners(partners.map(partner => 
      partner.id === partnerId ? {...partner, status: 'active'} : partner
    ));
    toast({
      title: "Partnership Accepted",
      description: "You're now accountability partners!",
    });
  };

  const handleDeclineRequest = (partnerId: string) => {
    setPartners(partners.filter(partner => partner.id !== partnerId));
    toast({
      title: "Request Declined",
      description: "Partnership request has been declined.",
    });
  };

  const handleRemovePartner = (partnerId: string) => {
    setPartners(partners.filter(partner => partner.id !== partnerId));
    toast({
      title: "Partnership Ended",
      description: "Your accountability partnership has been ended.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accountability Partners</h1>
            <p className="text-muted-foreground">
              Connect with partners who will help you stay accountable to your goals
            </p>
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:flex-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search partners..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleSendInvite}>
              <UserPlus className="h-4 w-4 mr-2" /> Invite Partner
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit">
            <TabsTrigger value="active">Active Partners ({activePartners.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingPartners.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 mt-4">
            {activePartners.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Partnerships</h3>
                  <p className="text-muted-foreground max-w-md">
                    Having an accountability partner makes you 65% more likely to reach your goals. Invite someone to be your partner!
                  </p>
                  <Button className="mt-6" onClick={handleSendInvite}>
                    <UserPlus className="h-4 w-4 mr-2" /> Find a Partner
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activePartners.map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 border">
                          <img src={partner.avatar} alt={partner.name} />
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-medium">{partner.name}</CardTitle>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Partners since {new Date(partner.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {partner.streak} day streak
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3 mt-2">
                        <div>
                          <p className="text-xs font-medium mb-1">Focused Habits:</p>
                          <div className="flex flex-wrap gap-1">
                            {partner.habitsFocusedOn.map((habit, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {habit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" /> 
                          Last check-in: {partner.lastCheckin ? new Date(partner.lastCheckin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No check-ins yet'}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-3 flex justify-between">
                      <Button variant="outline" size="sm">
                        <MessagesSquare className="h-4 w-4 mr-2" /> Message
                      </Button>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive/80 hover:text-destructive">
                            End Partnership
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">End this partnership?</h4>
                            <p className="text-sm text-muted-foreground">
                              This will remove your accountability relationship with {partner.name}.
                            </p>
                            <div className="flex gap-2 justify-end mt-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemovePartner(partner.id)}
                              >
                                End Partnership
                              </Button>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingPartners.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Invitations</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any pending partnership invitations at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingPartners.map(partner => (
                  <Card key={partner.id} className="overflow-hidden">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10 border">
                          <img src={partner.avatar} alt={partner.name} />
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-medium">{partner.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {partner.status === 'invited' ? 'Invitation sent' : 'Requested to be your partner'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-muted/50">
                        {partner.status === 'invited' ? 'Pending' : 'Request'}
                      </Badge>
                    </CardHeader>
                    <CardFooter className="pt-1 pb-3 flex justify-end gap-2">
                      {partner.status === 'pending' ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleDeclineRequest(partner.id)}>
                            <X className="h-4 w-4 mr-2" /> Decline
                          </Button>
                          <Button size="sm" onClick={() => handleAcceptRequest(partner.id)}>
                            <Check className="h-4 w-4 mr-2" /> Accept
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleRemovePartner(partner.id)}>
                          Cancel Invitation
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Partnerships;
