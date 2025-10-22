import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CharacterCard from '@/components/CharacterCard';
import LocationCard from '@/components/LocationCard';
import PostCard from '@/components/PostCard';
import CreateCharacterDialog from '@/components/CreateCharacterDialog';
import CreatePostDialog from '@/components/CreatePostDialog';
import LocationChat from '@/components/LocationChat';
import CreateLocationDialog from '@/components/CreateLocationDialog';
import { charactersApi, locationsApi, postsApi, DEFAULT_USER_ID } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { toast } = useToast();
  const [characters, setCharacters] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createCharacterOpen, setCreateCharacterOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createLocationOpen, setCreateLocationOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [charsData, locsData, postsData] = await Promise.all([
        charactersApi.getAll(),
        locationsApi.getAll(),
        postsApi.getAll(),
      ]);
      setCharacters(charsData);
      setLocations(locsData);
      setPosts(postsData);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCharacter = async (character: any) => {
    try {
      const newChar = await charactersApi.create(character);
      setCharacters([...characters, newChar]);
      toast({
        title: 'Успех!',
        description: `Персонаж ${newChar.name} создан`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать персонажа',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      await postsApi.create({
        character_id: parseInt(postData.characterId),
        location_id: parseInt(postData.locationId),
        content: postData.content,
      });
      await loadData();
      toast({
        title: 'Успех!',
        description: 'Пост опубликован',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать пост',
        variant: 'destructive',
      });
    }
  };

  const handleCreateLocation = async (location: any) => {
    try {
      const newLoc = await locationsApi.create(location);
      setLocations([...locations, { ...newLoc, message_count: 0 }]);
      toast({
        title: 'Успех!',
        description: `Локация ${newLoc.name} создана`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать локацию',
        variant: 'destructive',
      });
    }
  };

  const activeLocation = locations.find(l => l.id === activeLocationId);

  if (activeLocation) {
    return (
      <LocationChat
        location={activeLocation}
        characters={characters}
        onBack={() => setActiveLocationId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Nedin Roleplark
          </h1>
          <p className="text-muted-foreground text-lg">Фэнтези мир текстовых приключений</p>
        </header>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="feed" className="gap-2">
              <Icon name="Scroll" size={16} />
              <span className="hidden sm:inline">Лента</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Персонажи</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="gap-2">
              <Icon name="Map" size={16} />
              <span className="hidden sm:inline">Локации</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Лента постов</h2>
              <Button onClick={() => setCreatePostOpen(true)} className="gap-2">
                <Icon name="Plus" size={16} />
                Новый пост
              </Button>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Scroll" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Пока нет постов. Создайте первый!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Мои персонажи</h2>
              <Button onClick={() => setCreateCharacterOpen(true)} className="gap-2">
                <Icon name="Plus" size={16} />
                Создать персонажа
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={() => setSelectedCharacterId(character.id)}
                  isSelected={selectedCharacterId === character.id}
                />
              ))}
            </div>

            {characters.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет персонажей. Создайте своего героя!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Локации</h2>
              <Button onClick={() => setCreateLocationOpen(true)} className="gap-2">
                <Icon name="Plus" size={16} />
                Создать локацию
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={() => setActiveLocationId(location.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-xl p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Icon name="User" size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Игрок</h2>
                <p className="text-muted-foreground mb-6">Мастер приключений</p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{characters.length}</div>
                    <div className="text-sm text-muted-foreground">Персонажей</div>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{posts.length}</div>
                    <div className="text-sm text-muted-foreground">Постов</div>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{locations.length}</div>
                    <div className="text-sm text-muted-foreground">Локаций</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateCharacterDialog
        open={createCharacterOpen}
        onOpenChange={setCreateCharacterOpen}
        onCreateCharacter={handleCreateCharacter}
      />

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        characters={characters}
        locations={locations}
        onCreatePost={handleCreatePost}
      />

      <CreateLocationDialog
        open={createLocationOpen}
        onOpenChange={setCreateLocationOpen}
        onCreateLocation={handleCreateLocation}
      />
    </div>
  );
}