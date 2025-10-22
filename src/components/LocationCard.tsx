import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  messageCount: number;
}

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
}

export default function LocationCard({ location, onClick }: LocationCardProps) {
  return (
    <Card
      className="p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-card to-secondary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Icon name="MapPin" size={20} className="text-primary" />
            {location.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {location.description}
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {location.type}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="MessageCircle" size={14} />
              {location.messageCount} сообщений
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
