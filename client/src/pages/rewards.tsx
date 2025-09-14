import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Ticket, Wrench, Gift, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Reward } from "@shared/schema";

export default function Rewards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rewards, isLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await apiRequest("POST", `/api/rewards/${rewardId}/redeem`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Success!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge": return <Tag className="h-8 w-8" />;
      case "voucher": return <Ticket className="h-8 w-8" />;
      case "tool": return <Wrench className="h-8 w-8" />;
      default: return <Gift className="h-8 w-8" />;
    }
  };

  const getRewardIconColor = (type: string) => {
    switch (type) {
      case "badge": return "text-accent";
      case "voucher": return "text-primary";
      case "tool": return "text-secondary";
      default: return "text-primary";
    }
  };

  const getRewardBgColor = (type: string) => {
    switch (type) {
      case "badge": return "bg-accent/10";
      case "voucher": return "bg-primary/10";
      case "tool": return "bg-secondary/10";
      default: return "bg-primary/10";
    }
  };

  const handleRedeem = (reward: Reward) => {
    redeemMutation.mutate(reward.id);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const availableRewards = rewards?.filter(r => r.isUnlocked && !r.isRedeemed) || [];
  const lockedRewards = rewards?.filter(r => !r.isUnlocked) || [];
  const redeemedRewards = rewards?.filter(r => r.isRedeemed) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Rewards Catalog</h1>
        <p className="text-muted-foreground">Redeem your points for badges, vouchers, and farming tools</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" data-testid="available-tab">
            Available ({availableRewards.length})
          </TabsTrigger>
          <TabsTrigger value="locked" data-testid="locked-tab">
            Locked ({lockedRewards.length})
          </TabsTrigger>
          <TabsTrigger value="redeemed" data-testid="redeemed-tab">
            Redeemed ({redeemedRewards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${getRewardBgColor(reward.type)} rounded-lg flex items-center justify-center`}>
                      <div className={getRewardIconColor(reward.type)}>
                        {getRewardIcon(reward.type)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {reward.type}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-lg font-bold ${getRewardIconColor(reward.type)}`}>
                      {reward.points} points
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleRedeem(reward)}
                    disabled={redeemMutation.isPending}
                    data-testid={`redeem-reward-${reward.id}`}
                  >
                    {redeemMutation.isPending ? "Redeeming..." : "Redeem Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {availableRewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Available Rewards</h3>
              <p className="text-muted-foreground">Complete more challenges to unlock rewards!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedRewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${getRewardBgColor(reward.type)} rounded-lg flex items-center justify-center relative`}>
                      <div className={getRewardIconColor(reward.type)}>
                        {getRewardIcon(reward.type)}
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {reward.type}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-lg font-bold ${getRewardIconColor(reward.type)}`}>
                      {reward.points} points
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled
                    variant="secondary"
                    data-testid={`locked-reward-${reward.id}`}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Locked
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {lockedRewards.length === 0 && (
            <div className="text-center py-12">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All Rewards Unlocked</h3>
              <p className="text-muted-foreground">Great job! You've unlocked all available rewards.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="redeemed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redeemedRewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${getRewardBgColor(reward.type)} rounded-lg flex items-center justify-center relative`}>
                      <div className={getRewardIconColor(reward.type)}>
                        {getRewardIcon(reward.type)}
                      </div>
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <Badge variant="default" className="capitalize">
                      Redeemed
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-lg font-bold ${getRewardIconColor(reward.type)}`}>
                      {reward.points} points
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    disabled
                    data-testid={`redeemed-reward-${reward.id}`}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Redeemed
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {redeemedRewards.length === 0 && (
            <div className="text-center py-12">
              <Check className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Redeemed Rewards</h3>
              <p className="text-muted-foreground">Start redeeming rewards to see them here!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
