
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Star, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCategoryIcon } from "@/lib/habits";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  creator_name?: string;
  rating: number;
  downloads: number;
  is_featured?: boolean;
}

interface CommunityTemplatesProps {
  searchQuery?: string;
}

const CommunityTemplates: React.FC<CommunityTemplatesProps> = ({ searchQuery = '' }) => {
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // In a real implementation, you would fetch from Supabase
      // For now, simulate with dummy data
      setTimeout(() => {
        setTemplates([
          { 
            id: '1', 
            title: 'Daily Reading Habit', 
            description: 'Read for at least 20 minutes every day to improve knowledge and reduce stress',
            category: 'learning',
            frequency: 'daily',
            creator_name: 'Emily Wilson',
            rating: 4.8,
            downloads: 357,
            is_featured: true
          },
          { 
            id: '2', 
            title: 'Morning Meditation', 
            description: 'Start your day with 10 minutes of mindfulness meditation',
            category: 'mindfulness',
            frequency: 'daily',
            creator_name: 'Michael Johnson',
            rating: 4.6,
            downloads: 289
          },
          { 
            id: '3', 
            title: 'Weekly Meal Prep', 
            description: 'Prepare healthy meals for the week every Sunday',
            category: 'health',
            frequency: 'weekly',
            creator_name: 'Sara Lee',
            rating: 4.7,
            downloads: 412
          },
          { 
            id: '4', 
            title: '30-Day Exercise Challenge', 
            description: 'Gradually increase exercise duration over 30 days',
            category: 'fitness',
            frequency: 'daily',
            creator_name: 'Chris Fitness',
            rating: 4.9,
            downloads: 531,
            is_featured: true
          },
          { 
            id: '5', 
            title: 'Digital Detox Evening', 
            description: 'No screens for 1 hour before bed for better sleep',
            category: 'health',
            frequency: 'daily',
            creator_name: 'Sleep Expert',
            rating: 4.5,
            downloads: 278
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error fetching templates",
        description: "Please try again later",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleImportTemplate = (templateId: string) => {
    // In a real implementation, you would import the template to the user's habits via Supabase
    toast({
      title: "Template imported",
      description: "The habit template has been added to your habits",
    });
    
    // Update the downloads count
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, downloads: template.downloads + 1 } 
        : template
    ));
  };

  // Filter and sort templates
  let filteredTemplates = templates;
  
  // Apply search filter
  if (searchQuery) {
    filteredTemplates = filteredTemplates.filter(template => 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredTemplates = filteredTemplates.filter(template => 
      template.category === categoryFilter
    );
  }
  
  // Apply rating filter
  if (ratingFilter !== 'all') {
    const minRating = parseInt(ratingFilter);
    filteredTemplates = filteredTemplates.filter(template => 
      template.rating >= minRating
    );
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-20" />
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 bg-muted/20 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8 w-full"
            value={searchQuery}
            readOnly // Since we're receiving this as a prop
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit mb-4">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular" className="mt-0">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
              <p className="text-muted-foreground">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates
                .sort((a, b) => b.downloads - a.downloads)
                .map((template) => (
                  <TemplateCard 
                    key={template.id} 
                    template={template}
                    onImport={() => handleImportTemplate(template.id)}
                  />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured" className="mt-0">
          {filteredTemplates.filter(t => t.is_featured).length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
              <p className="text-muted-foreground">No featured templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates
                .filter(t => t.is_featured)
                .map((template) => (
                  <TemplateCard 
                    key={template.id} 
                    template={template}
                    onImport={() => handleImportTemplate(template.id)}
                  />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="newest" className="mt-0">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
              <p className="text-muted-foreground">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Just use the normal array since we don't have real timestamps */}
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template}
                  onImport={() => handleImportTemplate(template.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TemplateCardProps {
  template: HabitTemplate;
  onImport: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onImport }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(template.category as any)}</span>
              <CardTitle>{template.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Badge variant="outline">{template.frequency}</Badge>
              <Badge variant="outline">{template.category}</Badge>
            </div>
          </div>
          <div className="flex items-center text-amber-500">
            <Star className="fill-amber-500 h-4 w-4 mr-1" />
            <span className="font-medium">{template.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">{template.description}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Created by {template.creator_name || 'Anonymous'}</span>
          <span>{template.downloads} downloads</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          size="sm"
          onClick={onImport}
        >
          <Download className="h-4 w-4 mr-1" />
          Import Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityTemplates;
