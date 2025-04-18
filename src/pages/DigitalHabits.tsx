
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle } from 'lucide-react';

interface SiteBlockingRule {
  id?: string;
  site_url: string;
  site_category: 'productive' | 'neutral' | 'distracting';
  is_blocked: boolean;
  block_start_time?: string;
  block_end_time?: string;
  user_id?: string;
}

const DigitalHabits: React.FC = () => {
  const [rules, setRules] = useState<SiteBlockingRule[]>([]);
  const [newRule, setNewRule] = useState<SiteBlockingRule>({
    site_url: '',
    site_category: 'distracting',
    is_blocked: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSiteBlockingRules();
  }, []);

  const fetchSiteBlockingRules = async () => {
    const { data, error } = await supabase
      .from('site_blocking_rules')
      .select('*');
    
    if (error) {
      toast({
        title: "Error fetching rules",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setRules(data?.map(rule => ({
        ...rule,
        site_category: rule.site_category as 'productive' | 'neutral' | 'distracting'
      })) || []);
    }
  };

  const addSiteBlockingRule = async () => {
    if (!newRule.site_url) {
      toast({
        title: "Invalid Input",
        description: "Please enter a site URL",
        variant: "destructive"
      });
      return;
    }

    // Get the current user's ID from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add blocking rules",
        variant: "destructive"
      });
      return;
    }

    // Add the user_id to the rule
    const ruleWithUserId = {
      ...newRule,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('site_blocking_rules')
      .insert(ruleWithUserId)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding rule",
        description: error.message,
        variant: "destructive"
      });
    } else {
      const typedData = {
        ...data,
        site_category: data.site_category as 'productive' | 'neutral' | 'distracting'
      };
      
      setRules([...rules, typedData]);
      setNewRule({ site_url: '', site_category: 'distracting', is_blocked: false });
      toast({
        title: "Rule Added",
        description: "Site blocking rule created successfully"
      });
    }
  };

  const deleteSiteBlockingRule = async (ruleId: string) => {
    const { error } = await supabase
      .from('site_blocking_rules')
      .delete()
      .eq('id', ruleId);

    if (error) {
      toast({
        title: "Error deleting rule",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setRules(rules.filter(rule => rule.id !== ruleId));
      toast({
        title: "Rule Deleted",
        description: "Site blocking rule removed successfully"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Digital Habits Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Site Blocking Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input 
                placeholder="Enter site URL (e.g., facebook.com)" 
                value={newRule.site_url}
                onChange={(e) => setNewRule({...newRule, site_url: e.target.value})}
              />
              <Select 
                value={newRule.site_category}
                onValueChange={(value: 'productive' | 'neutral' | 'distracting') => 
                  setNewRule({...newRule, site_category: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productive">Productive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="distracting">Distracting</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addSiteBlockingRule}>
                <PlusCircle className="mr-2" /> Add Rule
              </Button>
            </div>

            <div className="space-y-2">
              {rules.map((rule) => (
                <div 
                  key={rule.id} 
                  className="flex items-center justify-between bg-muted p-3 rounded-lg"
                >
                  <div>
                    <p>{rule.site_url}</p>
                    <p className="text-sm text-muted-foreground">
                      Category: {rule.site_category}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => rule.id && deleteSiteBlockingRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DigitalHabits;
