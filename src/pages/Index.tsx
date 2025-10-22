import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CharacterCard from '@/components/CharacterCard';
import LocationCard from '@/components/LocationCard';
import PostCard from '@/components/PostCard';
import CreateCharacterDialog from '@/components/CreateCharacterDialog';
import CreatePostDialog from '@/components/CreatePostDialog';

export default function Index() {
  const [characters, setCharacters] = useState([
    {
      id: '1',
      name: 'Эльдрих Лунный',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eldritch',
      race: 'Эльф',
      class: 'Маг',
      description: 'Мудрый архимаг, хранитель древних знаний. Изучает забытые заклинания в башне Сапфирового ока.',
    },
    {
      id: '2',
      name: 'Торн Железный Молот',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thorn',
      race: 'Дварф',
      class: 'Воин',
      description: 'Бесстрашный воин из клана Железных Гор. Ищет легендарный меч своего предка.',
    },
  ]);

  const [locations, setLocations] = useState([
    {
      id: '1',
      name: 'Таверна "Золотой дракон"',
      type: 'Таверна',
      description: 'Уютное место в центре города, где собираются искатели приключений за кружкой эля.',
      messageCount: 42,
    },
    {
      id: '2',
      name: 'Тёмный лес',
      type: 'Локация',
      description: 'Загадочный лес на окраине королевства. Здесь водятся странные существа и скрыты древние руины.',
      messageCount: 28,
    },
    {
      id: '3',
      name: 'Королевский дворец',
      type: 'Город',
      description: 'Величественная резиденция короля Альдериха III. Место интриг и политических игр.',
      messageCount: 15,
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: '1',
      characterName: 'Эльдрих Лунный',
      characterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eldritch',
      locationName: 'Таверна "Золотой дракон"',
      content: 'Входит в таверну, стряхивая снег с плаща. Его посох тихо светится в полумраке. Взгляд скользит по залу в поисках знакомых лиц.\n\n"Хозяин, глинтвейна, пожалуйста. И если не сложно, есть ли свободный стол у камина?"',
      timestamp: '2 часа назад',
      likes: 5,
      comments: 3,
    },
    {
      id: '2',
      characterName: 'Торн Железный Молот',
      characterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thorn',
      locationName: 'Тёмный лес',
      content: 'Топор в руках, пробираюсь сквозь густые заросли. Ветки цепляются за броню, но я не обращаю внимания. Где-то здесь должна быть та самая пещера из легенд...\n\n*Осматриваюсь, прислушиваясь к звукам леса*',
      timestamp: '4 часа назад',
      likes: 8,
      comments: 5,
    },
  ]);

  const [createCharacterOpen, setCreateCharacterOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const handleCreateCharacter = (character: any) => {
    setCharacters([...characters, character]);
  };

  const handleCreatePost = (post: any) => {
    setPosts([post, ...posts]);
  };

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
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={() => console.log('Open location chat', location.id)}
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
    </div>
  );
}
