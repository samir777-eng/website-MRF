import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Trophy, Star} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  avatar?: string;
  level?: number;
  xp?: number;
  rank?: number;
  badges?: string[];
  stats?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
  onViewProfile?: () => void;
  className?: string;
  variant?: "default" | "compact";
}

export function ProfileCard({
  name,
  avatar,
  level,
  xp,
  rank,
  badges = [],
  stats = [],
  onViewProfile,
  className,
  variant = "default"}: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-lg border bg-card", className)}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{name}</div>
          {level && (
            <div className="text-sm text-muted-foreground">
              المستوى {level}
            </div>
          )}
        </div>
        {rank && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            #{rank}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      <div className="relative h-24 bg-gradient-to-r from-blue-600 to-purple-600">
        {rank && rank <= 3 && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              #{rank}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 -mt-12">
        <div className="flex items-start gap-4">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 mt-12">
            <h3 className="text-xl font-bold">{name}</h3>
            {level && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>المستوى {level}</span>
                {xp && <span>• {xp} نقطة خبرة</span>}
              </div>
            )}
          </div>
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.slice(0, 3).map((badge, index) => (
              <Badge key={index} variant="outline">
                {badge}
              </Badge>
            ))}
            {badges.length > 3 && (
              <Badge variant="outline">+{badges.length - 3}</Badge>
            )}
          </div>
        )}

        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.icon && (
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                )}
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {onViewProfile && (
          <Button onClick={onViewProfile} className="w-full mt-6">
            عرض الملف الشخصي
          </Button>
        )}
      </div>
    </div>
  );
}

