
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Help: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">Find answers to your questions and get support</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-9"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers about using Habit Sphere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create a new habit?</AccordionTrigger>
                  <AccordionContent>
                    To create a new habit, go to the Dashboard and click on the "Add Habit" button. 
                    Fill in the details about your habit, including name, description, frequency, 
                    and reminders. Once you've completed the form, click "Save" to add the new habit 
                    to your dashboard.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How are streaks calculated?</AccordionTrigger>
                  <AccordionContent>
                    Streaks are calculated based on consecutive days of completing your habit. 
                    If your habit is set for daily completion, you'll need to mark it complete 
                    each day to maintain your streak. For habits with specific days (e.g., Mon/Wed/Fri), 
                    you only need to complete the habit on those days to maintain your streak.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I edit a habit after creating it?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can edit a habit after creating it. Simply click on the habit card 
                    on your dashboard, then click the "Edit" button. You can modify the habit's 
                    name, description, frequency, and reminder settings. Be aware that changing 
                    the frequency may affect your current streak calculation.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I connect with friends?</AccordionTrigger>
                  <AccordionContent>
                    To connect with friends, go to the Social page and click on the "Find Friends" 
                    button. You can search for friends by username or email. Once you find your friend, 
                    click "Add Friend" to send a friend request. They will need to accept your request 
                    before you are connected.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>What are Challenges?</AccordionTrigger>
                  <AccordionContent>
                    Challenges are group activities where you and other users commit to forming 
                    or maintaining specific habits for a set period. You can join existing public 
                    challenges or create your own. Challenges are a great way to stay motivated 
                    and accountable with a community of like-minded individuals.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I delete my account?</AccordionTrigger>
                  <AccordionContent>
                    To delete your account, go to Settings, then scroll down to the Account section 
                    and click on "Delete Account". You will be asked to confirm this action. Please note 
                    that account deletion is permanent and all your data will be removed from our systems.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Still have questions? Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Support</h3>
                <p className="text-sm">support@habitsphere.com</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Response Time</h3>
                <p className="text-sm">Usually within 24 hours</p>
              </div>
              
              <div className="pt-4">
                <Button className="w-full">Contact Support</Button>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
