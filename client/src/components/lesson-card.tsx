import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import type { Lesson } from "@shared/schema";

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors" 
      onClick={onClick}
      data-testid={`lesson-card-${lesson.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img 
            src={lesson.imageUrl} 
            alt={lesson.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">{lesson.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {lesson.duration} min
              </span>
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                +{lesson.points} points
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
