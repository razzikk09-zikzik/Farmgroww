import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import LessonCard from "@/components/lesson-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Lesson } from "@shared/schema";

export default function Lessons() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Micro-Lessons</h1>
        <p className="text-muted-foreground">Learn sustainable farming practices through bite-sized lessons</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons?.map((lesson) => (
          <Dialog key={lesson.id}>
            <DialogTrigger asChild>
              <div>
                <LessonCard 
                  lesson={lesson}
                  onClick={() => setSelectedLesson(lesson)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{lesson.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img 
                  src={lesson.imageUrl} 
                  alt={lesson.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{lesson.category}</Badge>
                  <span className="text-sm text-muted-foreground">{lesson.duration} minutes</span>
                  <span className="text-sm text-primary font-medium">+{lesson.points} points</span>
                </div>
                <p className="text-muted-foreground">{lesson.description}</p>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{lesson.content}</div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1" data-testid={`complete-lesson-${lesson.id}`}>
                    Complete Lesson (+{lesson.points} pts)
                  </Button>
                  <Button variant="outline" data-testid={`bookmark-lesson-${lesson.id}`}>
                    Bookmark
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
