import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  avatar: string;
  race: string;
  class: string;
  description: string;
}

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CharacterCard({ character, onClick, isSelected }: CharacterCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
          <AvatarImage src={character.avatar} alt={character.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold">
            {character.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{character.name}</h3>
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              <Icon name="Sparkles" size={12} className="mr-1" />
              {character.race}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Icon name="Sword" size={12} className="mr-1" />
              {character.class}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
        </div>
      </div>
    </Card>
  );
}
