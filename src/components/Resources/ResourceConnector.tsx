import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Phone, 
  Video, 
  HeadphonesIcon, 
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Star
} from "lucide-react";

const resourceCategories = [
  { id: 'all', label: 'All Resources', icon: BookOpen },
  { id: 'counselors', label: 'Campus Counselors', icon: Video },
  { id: 'crisis', label: 'Crisis Support', icon: Phone },
  { id: 'articles', label: 'Articles & Guides', icon: BookOpen },
  { id: 'podcasts', label: 'Podcasts & Audio', icon: HeadphonesIcon },
];

const resources = [
  {
    id: 1,
    title: "Campus Counseling Center",
    category: "counselors",
    type: "In-Person",
    description: "Professional counseling services for students",
    availability: "Mon-Fri 9AM-5PM",
    location: "Student Health Building, 2nd Floor",
    rating: 4.8,
    tags: ["Free", "Confidential", "Walk-ins Welcome"],
    contact: "Call (555) 123-4567"
  },
  {
    id: 2,
    title: "Crisis Text Line",
    category: "crisis",
    type: "24/7 Support",
    description: "Free, confidential crisis support via text",
    availability: "24/7",
    location: "Text HOME to 741741",
    rating: 4.9,
    tags: ["24/7", "Anonymous", "Immediate"],
    contact: "Text HOME to 741741"
  },
  {
    id: 3,
    title: "Managing Academic Stress",
    category: "articles",
    type: "Article",
    description: "Comprehensive guide to handling academic pressure",
    availability: "Available anytime",
    location: "Online Resource",
    rating: 4.6,
    tags: ["Study Tips", "Time Management", "Self-Care"],
    contact: "Read Online"
  },
  {
    id: 4,
    title: "The Mindful Student Podcast",
    category: "podcasts",
    type: "Podcast Series",
    description: "Weekly episodes on mindfulness and student wellness",
    availability: "New episodes weekly",
    location: "All podcast platforms",
    rating: 4.7,
    tags: ["Mindfulness", "Weekly", "Student Stories"],
    contact: "Listen on Spotify/Apple"
  },
  {
    id: 5,
    title: "Peer Support Groups",
    category: "counselors",
    type: "Group Sessions",
    description: "Student-led support groups for various topics",
    availability: "Tuesdays & Thursdays 6PM",
    location: "Student Union, Room 201",
    rating: 4.5,
    tags: ["Peer-Led", "Group Setting", "Various Topics"],
    contact: "Sign up online"
  },
  {
    id: 6,
    title: "National Suicide Prevention Lifeline",
    category: "crisis",
    type: "Emergency",
    description: "24/7 suicide prevention and crisis support",
    availability: "24/7",
    location: "Call 988",
    rating: 5.0,
    tags: ["Emergency", "24/7", "Professional"],
    contact: "Call 988"
  }
];

export const ResourceConnector = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = resourceCategories.find(cat => cat.id === categoryId);
    return category?.icon || BookOpen;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Resource Connector
          </h1>
          <p className="text-muted-foreground">Find the right support and resources for you</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {resourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Resources */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredResources.map((resource) => {
            const Icon = getCategoryIcon(resource.category);
            return (
              <Card key={resource.id} className="wellness-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
                            {resource.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {resource.availability}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {resource.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {resource.contact}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No resources found matching your search.</p>
          </div>
        )}

        {/* Emergency Banner */}
        <Card className="max-w-2xl mx-auto mt-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-destructive mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you're in crisis or having thoughts of self-harm
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="destructive" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 988
                </Button>
                <Button variant="outline" size="sm">
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};