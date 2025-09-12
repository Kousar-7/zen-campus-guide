import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Plus, 
  Shield, 
  Clock,
  ArrowUp,
  User
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  timestamp: Date;
  upvotes: number;
  replies: number;
  category: 'anxiety' | 'depression' | 'stress' | 'general' | 'academic';
  isAnonymous: boolean;
}

const samplePosts: Post[] = [
  {
    id: '1',
    content: "Anyone else feeling overwhelmed with finals coming up? I've been having panic attacks and can't seem to focus on studying. How do you cope with academic stress?",
    timestamp: new Date(Date.now() - 3600000),
    upvotes: 23,
    replies: 8,
    category: 'academic',
    isAnonymous: true
  },
  {
    id: '2', 
    content: "I wanted to share that I finally talked to a counselor on campus after months of hesitation. It was scary but so worth it. For anyone thinking about it - you're not alone and seeking help is brave! 💙",
    timestamp: new Date(Date.now() - 7200000),
    upvotes: 45,
    replies: 12,
    category: 'general',
    isAnonymous: false
  },
  {
    id: '3',
    content: "Does anyone have tips for dealing with social anxiety in group projects? I freeze up and can't contribute, which makes me feel even worse about myself.",
    timestamp: new Date(Date.now() - 10800000),
    upvotes: 17,
    replies: 6,
    category: 'anxiety',
    isAnonymous: true
  }
];

const categories = [
  { id: 'general', label: 'General Support', color: 'bg-primary' },
  { id: 'anxiety', label: 'Anxiety', color: 'bg-warning' },
  { id: 'depression', label: 'Depression', color: 'bg-secondary' },
  { id: 'stress', label: 'Stress', color: 'bg-accent' },
  { id: 'academic', label: 'Academic Pressure', color: 'bg-success' }
];

export const PeerSupport = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const filteredPosts = activeCategory === 'general' 
    ? samplePosts 
    : samplePosts.filter(post => post.category === activeCategory);

  const handleUpvote = (postId: string) => {
    console.log('Upvoted post:', postId);
    // Here you would handle upvoting
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    
    // Here you would submit the post to backend
    console.log('Submitting post:', { content: newPost, category: activeCategory, isAnonymous });
    
    setNewPost('');
    setShowNewPost(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Peer Support</h1>
              <p className="text-sm text-muted-foreground">Anonymous safe space</p>
            </div>
          </div>
          <Button onClick={() => setShowNewPost(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Safety Notice */}
        <Card className="wellness-card border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-accent mb-1">Safe Space Guidelines</p>
                <p className="text-muted-foreground">
                  Be kind, respectful, and supportive. No personal information sharing. 
                  If you're in crisis, please contact emergency services immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="font-semibold mb-3">Support Groups</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <Card className="wellness-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share what's on your mind. Your post will help others feel less alone..."
                className="min-h-[100px]"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    Post anonymously (recommended)
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitPost} disabled={!newPost.trim()}>
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="wellness-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Post header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {post.isAnonymous ? 'Anonymous Student' : 'Student'}
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {categories.find(c => c.id === post.category)?.label}
                    </Badge>
                  </div>

                  {/* Post content */}
                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {/* Post actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>{post.upvotes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </button>
                    </div>

                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="w-4 h-4 mr-1" />
                      Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">1.2k</div>
                <div className="text-xs text-muted-foreground">Students helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">856</div>
                <div className="text-xs text-muted-foreground">Posts shared</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-xs text-muted-foreground">Support available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};