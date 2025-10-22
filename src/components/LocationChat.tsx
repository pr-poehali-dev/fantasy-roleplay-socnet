import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Character {
  id: string;
  name: string;
  avatar: string;
  race: string;
  class: string;
}

interface Message {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  content: string;
  timestamp: string;
}

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface LocationChatProps {
  location: Location;
  characters: Character[];
  onBack: () => void;
}

export default function LocationChat({ location, characters, onBack }: LocationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      characterId: '1',
      characterName: 'Эльдрих Лунный',
      characterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eldritch',
      content: 'Входит в таверну, стряхивая снег с плаща. Посох тихо светится в полумраке.',
      timestamp: '10:32',
    },
    {
      id: '2',
      characterId: '2',
      characterName: 'Торн Железный Молот',
      characterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thorn',
      content: '*Поднимает кружку эля в приветствии* Эльдрих! Рад тебя видеть, старина!',
      timestamp: '10:35',
    },
  ]);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedCharacterId) return;

    const character = characters.find(c => c.id === selectedCharacterId);
    if (!character) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      characterId: character.id,
      characterName: character.name,
      characterAvatar: character.avatar,
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <Icon name="ArrowLeft" size={16} />
            Назад к локациям
          </Button>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="MapPin" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{location.name}</h1>
              <p className="text-muted-foreground mb-2">{location.description}</p>
              <Badge variant="secondary">{location.type}</Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <Card className="flex flex-col h-[calc(100vh-280px)]">
            <div className="p-4 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <Icon name="MessageCircle" size={18} />
                Чат локации
              </h2>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3 animate-fade-in">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                      <AvatarImage src={message.characterAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xs">
                        {message.characterName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm">{message.characterName}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap bg-secondary/50 rounded-lg px-3 py-2">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите персонажа" />
                    </SelectTrigger>
                    <SelectContent>
                      {characters.map((character) => (
                        <SelectItem key={character.id} value={character.id}>
                          {character.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCharacter && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={selectedCharacter.avatar} />
                      <AvatarFallback className="text-xs">
                        {selectedCharacter.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedCharacter.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Напишите действие или реплику от лица персонажа..."
                  rows={3}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!messageText.trim() || !selectedCharacterId}
                  className="self-end"
                >
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Users" size={18} />
                Персонажи в локации
              </h3>
              <div className="space-y-2">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={character.avatar} />
                      <AvatarFallback className="text-xs">
                        {character.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{character.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {character.race} • {character.class}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Info" size={18} />
                Подсказка
              </h3>
              <p className="text-sm text-muted-foreground">
                Используйте звёздочки для описания действий: *делает что-то*
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Кавычки для прямой речи: "Говорит что-то"
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
