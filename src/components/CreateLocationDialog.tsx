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

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLocation: (location: any) => void;
}

export default function CreateLocationDialog({ open, onOpenChange, onCreateLocation }: CreateLocationDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateLocation({
      id: Date.now().toString(),
      name,
      type,
      description,
      messageCount: 0,
    });
    setName('');
    setType('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Создать локацию</DialogTitle>
          <DialogDescription>
            Придумайте новое место для приключений
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название локации</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Пещера забытых теней"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Тип локации</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Таверна">Таверна</SelectItem>
                <SelectItem value="Город">Город</SelectItem>
                <SelectItem value="Лес">Лес</SelectItem>
                <SelectItem value="Пещера">Пещера</SelectItem>
                <SelectItem value="Замок">Замок</SelectItem>
                <SelectItem value="Храм">Храм</SelectItem>
                <SelectItem value="Подземелье">Подземелье</SelectItem>
                <SelectItem value="Горы">Горы</SelectItem>
                <SelectItem value="Море">Море</SelectItem>
                <SelectItem value="Другое">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите атмосферу, особенности и что можно здесь найти..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Создать локацию
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
