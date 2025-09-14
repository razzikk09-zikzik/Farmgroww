import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Challenge } from "@shared/schema";

interface ChallengeCardProps {
  challenge: Challenge;
  onSubmitProof?: () => void;
}

export default function ChallengeCard({ challenge, onSubmitProof }: ChallengeCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-primary";
    if (progress >= 40) return "bg-accent";
    return "bg-secondary";
  };

  const getProgressBadgeColor = (progress: number) => {
    if (progress >= 70) return "bg-primary/10 text-primary";
    if (progress >= 40) return "bg-accent/10 text-accent";
    return "bg-secondary/10 text-secondary";
  };

  return (
    <Card data-testid={`challenge-card-${challenge.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">{challenge.title}</h4>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getProgressBadgeColor(challenge.progress)}`}>
            {challenge.progress}% Complete
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 bg-muted rounded-full h-2 mr-4">
            <div 
              className={`${getProgressColor(challenge.progress)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">{challenge.progressText}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {challenge.daysLeft} days left
          </span>
          <Button 
            size="sm" 
            onClick={onSubmitProof}
            data-testid={`submit-proof-${challenge.id}`}
          >
            Submit Proof
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
