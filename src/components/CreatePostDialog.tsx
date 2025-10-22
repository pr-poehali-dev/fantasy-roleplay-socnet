import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Character {
  id: string;
  name: string;
  avatar: string;
  race: string;
  class: string;
}

interface Location {
  id: string;
  name: string;
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters: Character[];
  locations: Location[];
  onCreatePost: (post: any) => void;
}

export default function CreatePostDialog({ 
  open, 
  onOpenChange, 
  characters, 
  locations,
  onCreatePost 
}: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const character = characters.find(c => c.id === selectedCharacterId);
    const location = locations.find(l => l.id === selectedLocationId);
    
    if (!character || !location) return;

    onCreatePost({
      id: Date.now().toString(),
      characterName: character.name,
      characterAvatar: character.avatar,
      locationName: location.name,
      content,
      timestamp: 'Только что',
      likes: 0,
      comments: 0,
    });

    setContent('');
    setSelectedCharacterId('');
    setSelectedLocationId('');
    onOpenChange(false);
  };

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Новый пост</DialogTitle>
          <DialogDescription>
            Напишите историю от лица вашего персонажа
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="character">Персонаж</Label>
            <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите персонажа" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    <div className="flex items-center gap-2">
                      {character.name} ({character.race} - {character.class})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCharacter && (
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedCharacter.avatar} />
                <AvatarFallback>{selectedCharacter.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{selectedCharacter.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedCharacter.race} • {selectedCharacter.class}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Локация</Label>
            <Select value={selectedLocationId} onValueChange={setSelectedLocationId} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите локацию" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Текст поста</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Расскажите, что делает ваш персонаж, что он видит или о чём думает..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!selectedCharacterId || !selectedLocationId}>
            Опубликовать
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
