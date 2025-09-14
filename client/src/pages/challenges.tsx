import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ChallengeCard from "@/components/challenge-card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Challenge } from "@shared/schema";

export default function Challenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [proofText, setProofText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const submitProofMutation = useMutation({
    mutationFn: async (data: { challengeId: string; proof: string }) => {
      const response = await apiRequest("POST", `/api/challenges/${data.challengeId}/submit-proof`, { proof: data.proof });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      toast({
        title: "Success",
        description: "Challenge proof submitted successfully!",
      });
      setIsDialogOpen(false);
      setProofText("");
      setSelectedChallenge(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit proof. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitProof = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsDialogOpen(true);
  };

  const handleProofSubmission = () => {
    if (!selectedChallenge || !proofText.trim()) {
      toast({
        title: "Error",
        description: "Please provide proof details.",
        variant: "destructive",
      });
      return;
    }

    submitProofMutation.mutate({
      challengeId: selectedChallenge.id,
      proof: proofText,
    });
  };

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

  const activeChallenges = challenges?.filter(c => c.isActive) || [];
  const completedChallenges = challenges?.filter(c => !c.isActive) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Challenges</h1>
        <p className="text-muted-foreground">Complete farming challenges to earn points and improve your skills</p>
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeChallenges.map((challenge) => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge}
              onSubmitProof={() => handleSubmitProof(challenge)}
            />
          ))}
        </div>
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Completed Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{challenge.title}</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">+{challenge.points} points earned</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Proof Submission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Challenge Proof</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">{selectedChallenge?.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedChallenge?.description}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proof">Proof Details</Label>
              <Textarea
                id="proof"
                placeholder="Describe your progress, attach photos, or provide other evidence of completion..."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                className="min-h-[100px]"
                data-testid="proof-textarea"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Photo Evidence (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                disabled
                className="opacity-50"
                data-testid="photo-upload"
              />
              <p className="text-xs text-muted-foreground">Photo upload feature coming soon</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleProofSubmission}
                disabled={submitProofMutation.isPending}
                className="flex-1"
                data-testid="submit-proof-button"
              >
                {submitProofMutation.isPending ? "Submitting..." : "Submit Proof"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                data-testid="cancel-proof-button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
