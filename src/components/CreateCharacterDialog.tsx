import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCharacter: (character: any) => void;
}

export default function CreateCharacterDialog({ open, onOpenChange, onCreateCharacter }: CreateCharacterDialogProps) {
  const [name, setName] = useState('');
  const [race, setRace] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCharacter({
      id: Date.now().toString(),
      name,
      race,
      class: characterClass,
      description,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
    setName('');
    setRace('');
    setCharacterClass('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Создать персонажа</DialogTitle>
          <DialogDescription>
            Придумайте нового героя для своих приключений
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя персонажа</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Эльдрих Лунный"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="race">Раса</Label>
            <Select value={race} onValueChange={setRace} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите расу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Эльф">Эльф</SelectItem>
                <SelectItem value="Человек">Человек</SelectItem>
                <SelectItem value="Дварф">Дварф</SelectItem>
                <SelectItem value="Орк">Орк</SelectItem>
                <SelectItem value="Полурослик">Полурослик</SelectItem>
                <SelectItem value="Драконорождённый">Драконорождённый</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Класс</Label>
            <Select value={characterClass} onValueChange={setCharacterClass} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Воин">Воин</SelectItem>
                <SelectItem value="Маг">Маг</SelectItem>
                <SelectItem value="Плут">Плут</SelectItem>
                <SelectItem value="Жрец">Жрец</SelectItem>
                <SelectItem value="Следопыт">Следопыт</SelectItem>
                <SelectItem value="Бард">Бард</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите о характере, внешности и истории персонажа..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Создать персонажа
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
