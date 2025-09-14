import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/stats-card";
import LessonCard from "@/components/lesson-card";
import ChallengeCard from "@/components/challenge-card";
import { 
  Star, 
  Trophy, 
  Target, 
  Medal, 
  BookOpen, 
  Flag, 
  TrendingUp, 
  Gift,
  CloudRain,
  ChartLine,
  Lightbulb,
  Calendar,
  Sprout,
  Apple,
  Leaf,
  Tag,
  Ticket,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  user: any;
  challenges: any[];
  lessons: any[];
  marketPrices: any[];
  leaderboard: any[];
  alerts: any[];
  rewards: any[];
}

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    toast({
      title: "Navigation",
      description: `Navigating to ${action}...`,
    });
  };

  const handleSubmitProof = (challengeId: string) => {
    toast({
      title: "Proof Submission",
      description: "Challenge proof submission feature coming soon!",
    });
  };

  const handleTransportRequest = (crop: string) => {
    toast({
      title: "Transport Request",
      description: `Transport request for ${crop} submitted successfully!`,
    });
  };

  const handleRedeemReward = (rewardId: string) => {
    toast({
      title: "Reward Redemption",
      description: "Reward redemption feature coming soon!",
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "weather": return <CloudRain className="text-primary text-sm" />;
      case "price": return <ChartLine className="text-accent text-sm" />;
      case "tip": return <Lightbulb className="text-secondary text-sm" />;
      case "reminder": return <Calendar className="text-muted-foreground text-sm" />;
      default: return <Calendar className="text-muted-foreground text-sm" />;
    }
  };

  const getCropIcon = (crop: string) => {
    switch (crop.toLowerCase()) {
      case "rice": return <Sprout className="text-accent text-sm" />;
      case "tomato": return <Apple className="text-destructive text-sm" />;
      case "banana": return <Leaf className="text-accent text-sm" />;
      default: return <Sprout className="text-accent text-sm" />;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge": return <Tag className="text-accent" />;
      case "voucher": return <Ticket className="text-primary" />;
      case "tool": return <Wrench className="text-secondary" />;
      default: return <Gift className="text-primary" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome back, {data.user?.name || "Farmer"}!
        </h2>
        <p className="text-muted-foreground">Continue your sustainable farming journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatsCard
          title="Total Points"
          value={data.user?.points || 0}
          icon={<Star className="text-primary h-6 w-6" />}
          iconBgColor="bg-primary/10"
        />
        <StatsCard
          title="Current Level"
          value={data.user?.level || "Bronze"}
          icon={<Trophy className="text-accent h-6 w-6" />}
          iconBgColor="bg-accent/10"
        />
        <StatsCard
          title="Active Challenges"
          value={data.user?.activeChallenges || 0}
          icon={<Target className="text-secondary h-6 w-6" />}
          iconBgColor="bg-secondary/10"
        />
        <StatsCard
          title="Rank"
          value={`#${data.user?.rank || 1}`}
          icon={<Medal className="text-primary h-6 w-6" />}
          iconBgColor="bg-primary/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/lessons">
          <Button 
            className="w-full bg-primary text-primary-foreground p-4 h-auto flex flex-col items-center space-y-2 hover:bg-primary/90"
            data-testid="quick-action-lessons"
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-medium">Lessons</span>
          </Button>
        </Link>
        <Link href="/challenges">
          <Button 
            className="w-full bg-accent text-accent-foreground p-4 h-auto flex flex-col items-center space-y-2 hover:bg-accent/90"
            data-testid="quick-action-challenges"
          >
            <Flag className="h-6 w-6" />
            <span className="font-medium">Challenges</span>
          </Button>
        </Link>
        <Link href="/market">
          <Button 
            className="w-full bg-secondary text-secondary-foreground p-4 h-auto flex flex-col items-center space-y-2 hover:bg-secondary/90"
            data-testid="quick-action-market"
          >
            <TrendingUp className="h-6 w-6" />
            <span className="font-medium">Market</span>
          </Button>
        </Link>
        <Link href="/rewards">
          <Button 
            variant="outline"
            className="w-full p-4 h-auto flex flex-col items-center space-y-2"
            data-testid="quick-action-rewards"
          >
            <Gift className="h-6 w-6" />
            <span className="font-medium">Rewards</span>
          </Button>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Lessons */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Lessons</CardTitle>
                <Link href="/lessons">
                  <Button variant="ghost" size="sm" data-testid="view-all-lessons">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.lessons?.map((lesson) => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson}
                />
              ))}
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Challenges</CardTitle>
                <Link href="/challenges">
                  <Button variant="ghost" size="sm" data-testid="view-all-challenges">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.challenges?.map((challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge}
                  onSubmitProof={() => handleSubmitProof(challenge.id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Market Prices */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Market Prices</CardTitle>
                <Link href="/market">
                  <Button variant="ghost" size="sm" data-testid="view-market">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Crop</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Change</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.marketPrices?.map((price) => (
                      <tr key={price.id}>
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                              {getCropIcon(price.crop)}
                            </div>
                            <span className="font-medium text-foreground">{price.crop}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 font-medium text-foreground">{price.price}</td>
                        <td className="text-right py-3">
                          <span className={`text-sm font-medium ${
                            price.change > 0 ? "text-primary" : "text-destructive"
                          }`}>
                            {price.change > 0 ? "+" : ""}{price.change}%
                          </span>
                        </td>
                        <td className="text-right py-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTransportRequest(price.crop)}
                            data-testid={`transport-request-${price.crop.toLowerCase()}`}
                          >
                            Request Transport
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Community Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.leaderboard?.map((farmer, index) => {
                const getRankBadgeColor = (rank: number) => {
                  if (rank === 1) return "bg-accent text-accent-foreground";
                  if (rank === 2) return "bg-secondary text-secondary-foreground";
                  if (rank === 3) return "bg-muted-foreground text-background";
                  return "bg-primary text-primary-foreground";
                };

                return (
                  <div 
                    key={farmer.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      farmer.isCurrentUser 
                        ? "bg-primary/5 border-2 border-primary/20" 
                        : index === 0 
                          ? "bg-accent/5" 
                          : "bg-muted/30"
                    }`}
                    data-testid={`leaderboard-entry-${farmer.rank}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadgeColor(farmer.rank)}`}>
                        <span className="text-sm font-bold">{farmer.rank}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {farmer.isCurrentUser ? `You (${farmer.name})` : farmer.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{farmer.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{farmer.points} pts</p>
                      <div className="flex items-center space-x-1">
                        <Trophy className={`h-3 w-3 ${
                          farmer.rank === 1 ? "text-accent" : 
                          farmer.rank === 2 ? "text-secondary" :
                          farmer.rank === 3 ? "text-muted-foreground" : "text-primary"
                        }`} />
                        <span className="text-xs text-muted-foreground">{farmer.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Rewards</CardTitle>
                <Link href="/rewards">
                  <Button variant="ghost" size="sm" data-testid="view-all-rewards">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.rewards?.map((reward) => (
                <div key={reward.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        reward.type === "badge" ? "bg-accent/10" :
                        reward.type === "voucher" ? "bg-primary/10" : "bg-secondary/10"
                      }`}>
                        {getRewardIcon(reward.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{reward.title}</h4>
                        <p className="text-xs text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      reward.type === "badge" ? "text-accent" :
                      reward.type === "voucher" ? "text-primary" : "text-secondary"
                    }`}>
                      {reward.points} pts
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={!reward.isUnlocked || reward.isRedeemed}
                    onClick={() => handleRedeemReward(reward.id)}
                    data-testid={`redeem-reward-${reward.id}`}
                  >
                    {reward.isRedeemed ? "Redeemed" : 
                     reward.isUnlocked ? "Redeem Now" : "Locked"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts & Tips */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Alerts & Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.alerts?.map((alert) => (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.type === "weather" ? "bg-primary/5 border-primary/20" :
                    alert.type === "price" ? "bg-accent/5 border-accent/20" :
                    alert.type === "tip" ? "bg-secondary/5 border-secondary/20" :
                    "bg-muted/30 border-border"
                  }`}
                  data-testid={`alert-${alert.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      alert.type === "weather" ? "bg-primary/10" :
                      alert.type === "price" ? "bg-accent/10" :
                      alert.type === "tip" ? "bg-secondary/10" :
                      "bg-muted-foreground/10"
                    }`}>
                      {getIconForType(alert.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
