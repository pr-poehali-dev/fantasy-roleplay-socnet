import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Post {
  id: string;
  character_name?: string;
  character_avatar?: string;
  location_name?: string;
  characterName?: string;
  characterAvatar?: string;
  locationName?: string;
  content: string;
  timestamp?: string;
  created_at?: string;
  likes: number;
  comments?: number;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const characterName = post.character_name || post.characterName || 'Unknown';
  const characterAvatar = post.character_avatar || post.characterAvatar || '';
  const locationName = post.location_name || post.locationName || 'Unknown';
  const timestamp = post.timestamp || (post.created_at ? new Date(post.created_at).toLocaleString('ru-RU') : 'Just now');
  
  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-primary/20">
          <AvatarImage src={characterAvatar} alt={characterName} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent">
            {characterName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-base">{characterName}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} />
                <span>{locationName}</span>
                <span>•</span>
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Icon name="Heart" size={16} />
              <span className="text-xs">{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Icon name="MessageCircle" size={16} />
              <span className="text-xs">{post.comments || 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}