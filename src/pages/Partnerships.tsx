
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageSquare, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Users,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistance, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Partnership {
  id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;
  status: 'invited' | 'active' | 'inactive';
  created_at: string;
  last_checkin?: string;
  streak_days: number;
  checkins: CheckIn[];
}

interface CheckIn {
  id: string;
  user_id: string;
  user_name: string;
  notes: string;
  created_at: string;
}

const Partnerships: React.FC = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePartnership, setActivePartnership] = useState<Partnership | null>(null);
  const [checkInNote, setCheckInNote] = useState('');
  const [newPartnerDialog, setNewPartnerDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      // In a real implementation, you would fetch from Supabase
      // For now, simulate with dummy data
      setTimeout(() => {
        setPartnerships([
          {
            id: '1',
            partner_id: '101',
            partner_name: 'Jane Smith',
            status: 'active',
            created_at: '2025-03-15T10:30:00Z',
            last_checkin: '2025-04-15T14:20:00Z',
            streak_days: 12,
            checkins: [
              {
                id: 'c1',
                user_id: '101',
                user_name: 'Jane Smith',
                notes: 'I completed my meditation habit today and started a new book!',
                created_at: '2025-04-15T14:20:00Z'
              },
              {
                id: 'c2',
                user_id: 'current-user',
                user_name: 'You',
                notes: 'Exercised for 30 minutes and read for 20 minutes today.',
                created_at: '2025-04-15T10:15:00Z'
              },
              {
                id: 'c3',
                user_id: '101',
                user_name: 'Jane Smith',
                notes: 'Had a productive day, completed 3 habits.',
                created_at: '2025-04-14T16:45:00Z'
              }
            ]
          },
          {
            id: '2',
            partner_id: '102',
            partner_name: 'Michael Johnson',
            status: 'active',
            created_at: '2025-03-20T09:15:00Z',
            last_checkin: '2025-04-14T18:30:00Z',
            streak_days: 8,
            checkins: [
              {
                id: 'c4',
                user_id: '102',
                user_name: 'Michael Johnson',
                notes: 'Did my morning run and meditation.',
                created_at: '2025-04-14T18:30:00Z'
              },
              {
                id: 'c5',
                user_id: 'current-user',
                user_name: 'You',
                notes: 'Completed 2 habits today, but missed my reading.',
                created_at: '2025-04-14T11:20:00Z'
              }
            ]
          },
          {
            id: '3',
            partner_id: '103',
            partner_name: 'Sarah Garcia',
            status: 'invited',
            created_at: '2025-04-12T15:45:00Z',
            streak_days: 0,
            checkins: []
          }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching partnerships:', error);
      toast({
        title: "Error fetching partnerships",
        description: "Please try again later",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleCheckIn = () => {
    if (!activePartnership || !checkInNote.trim()) return;
    
    // In a real implementation, you would add the check-in via Supabase
    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      user_id: 'current-user',
      user_name: 'You',
      notes: checkInNote.trim(),
      created_at: new Date().toISOString()
    };
    
    // Update partnerships state
    setPartnerships(prevPartnerships => 
      prevPartnerships.map(partnership => 
        partnership.id === activePartnership.id
          ? {
              ...partnership,
              last_checkin: new Date().toISOString(),
              checkins: [newCheckIn, ...partnership.checkins]
            }
          : partnership
      )
    );
    
    setCheckInNote('');
    
    toast({
      title: "Check-in recorded",
      description: "Your accountability partner has been notified",
    });
  };

  const handleAddPartner = () => {
    if (!selectedFriend) return;
    
    // In a real implementation, you would send invitation via Supabase
    const newPartnership: Partnership = {
      id: Date.now().toString(),
      partner_id: selectedFriend,
      partner_name: selectedFriend === '201' ? 'Emily Wilson' : 'David Brown',
      status: 'invited',
      created_at: new Date().toISOString(),
      streak_days: 0,
      checkins: []
    };
    
    setPartnerships([...partnerships, newPartnership]);
    setNewPartnerDialog(false);
    setSelectedFriend('');
    
    toast({
      title: "Invitation sent",
      description: "They'll receive your accountability partner request",
    });
  };

  const handleAcceptInvitation = (partnershipId: string) => {
    // In a real implementation, you would update the partnership status via Supabase
    setPartnerships(prevPartnerships => 
      prevPartnerships.map(partnership => 
        partnership.id === partnershipId
          ? { ...partnership, status: 'active' }
          : partnership
      )
    );
    
    toast({
      title: "Invitation accepted",
      description: "You are now accountability partners",
    });
  };

  const handleRejectInvitation = (partnershipId: string) => {
    // In a real implementation, you would update or delete the partnership via Supabase
    setPartnerships(prevPartnerships => 
      prevPartnerships.filter(partnership => partnership.id !== partnershipId)
    );
    
    toast({
      title: "Invitation rejected",
    });
  };

  const renderPartnershipList = (status: 'active' | 'invited' | 'all' = 'all') => {
    const filteredPartnerships = partnerships.filter(p => 
      status === 'all' || p.status === status
    );
    
    if (filteredPartnerships.length === 0) {
      return (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
          <p className="text-muted-foreground">
            {status === 'invited' 
              ? 'No pending invitations.'
              : status === 'active'
                ? 'No active accountability partnerships yet.'
                : 'No accountability partnerships found.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartnerships.map((partnership) => (
          <Card key={partnership.id} className={partnership.status === 'invited' ? 'border-amber-500/50' : ''}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={partnership.partner_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${partnership.partner_name}`} />
                <AvatarFallback>{partnership.partner_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{partnership.partner_name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {partnership.status === 'invited'
                      ? 'Invited '
                      : 'Partners since '}
                    {formatDistance(new Date(partnership.created_at), new Date(), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {partnership.status === 'active' && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>
                      {partnership.last_checkin
                        ? `Last check-in ${formatDistance(new Date(partnership.last_checkin), new Date(), { addSuffix: true })}`
                        : 'No check-ins yet'}
                    </span>
                  </div>
                  <Badge variant="secondary">{partnership.streak_days} day streak</Badge>
                </div>
              )}
              
              {partnership.status === 'invited' && (
                <div className="text-sm text-amber-600 mb-2">
                  Waiting for response...
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              {partnership.status === 'active' ? (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                    onClick={() => setActivePartnership(partnership)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Check-in
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAcceptInvitation(partnership.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRejectInvitation(partnership.id)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-12 w-72" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accountability Partners</h1>
            <p className="text-muted-foreground">
              Stay motivated with daily check-ins and support from your partners
            </p>
          </div>
          <Dialog open={newPartnerDialog} onOpenChange={setNewPartnerDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Accountability Partner</DialogTitle>
                <DialogDescription>
                  Choose a friend to be your accountability partner. You'll help each other stay consistent with daily check-ins.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select a friend</label>
                  <Select onValueChange={setSelectedFriend} value={selectedFriend}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a friend" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="201">Emily Wilson</SelectItem>
                      <SelectItem value="202">David Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewPartnerDialog(false)}>Cancel</Button>
                <Button onClick={handleAddPartner} disabled={!selectedFriend}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit mb-4">
            <TabsTrigger value="active">Active Partners</TabsTrigger>
            <TabsTrigger value="invitations" className="relative">
              Invitations
              {partnerships.filter(p => p.status === 'invited').length > 0 && (
                <Badge className="ml-1 bg-amber-500">{partnerships.filter(p => p.status === 'invited').length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {renderPartnershipList('active')}
          </TabsContent>
          
          <TabsContent value="invitations" className="mt-0">
            {renderPartnershipList('invited')}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Check-in Dialog */}
      <Dialog open={!!activePartnership} onOpenChange={(open) => !open && setActivePartnership(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Daily Check-in</DialogTitle>
            <DialogDescription>
              Share your progress with {activePartnership?.partner_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Today's update</label>
              <Textarea
                placeholder="Share which habits you completed today, any challenges you faced, or goals for tomorrow..."
                className="min-h-[100px]"
                value={checkInNote}
                onChange={(e) => setCheckInNote(e.target.value)}
              />
            </div>
            
            {activePartnership?.checkins.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Recent check-ins</h4>
                <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2">
                  {activePartnership.checkins.map((checkin) => (
                    <div key={checkin.id} className="flex gap-3 text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{checkin.user_name === 'You' ? 'Y' : checkin.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{checkin.user_name}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistance(new Date(checkin.created_at), new Date(), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="mt-1">{checkin.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivePartnership(null)}>Cancel</Button>
            <Button onClick={handleCheckIn} disabled={!checkInNote.trim()}>Submit Check-in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Partnerships;
