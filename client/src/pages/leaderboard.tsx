import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-500" />;
      default: return <Award className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500 text-white";
      case 2: return "bg-gray-400 text-white";
      case 3: return "bg-orange-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "silver": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "bronze": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-primary/10 text-primary";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Leaderboard Data</h3>
          <p className="text-muted-foreground">Check back later for community rankings!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among fellow farmers in your community</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((farmer, index) => {
          const actualRank = farmer.rank;
          const podiumOrder = [1, 0, 2]; // Second place, first place, third place for visual effect
          const displayIndex = podiumOrder.indexOf(index);
          
          return (
            <Card 
              key={farmer.id} 
              className={`text-center ${
                actualRank === 1 ? "ring-2 ring-yellow-500 md:order-2" :
                actualRank === 2 ? "md:order-1" : "md:order-3"
              } ${farmer.isCurrentUser ? "ring-2 ring-primary" : ""}`}
              data-testid={`podium-${actualRank}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRankBadgeColor(actualRank)}`}>
                    <span className="text-2xl font-bold">{actualRank}</span>
                  </div>
                  {getRankIcon(actualRank)}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {farmer.isCurrentUser ? `You (${farmer.name})` : farmer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{farmer.location}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{farmer.points}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                  <Badge className={getLevelBadgeColor(farmer.level)}>
                    {farmer.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((farmer) => (
              <div 
                key={farmer.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  farmer.isCurrentUser 
                    ? "bg-primary/10 border-2 border-primary/20" 
                    : "bg-muted/50 hover:bg-muted"
                }`}
                data-testid={`leaderboard-row-${farmer.rank}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(farmer.rank)}`}>
                    {farmer.rank}
                  </div>
                  <div className="flex items-center space-x-3">
                    {farmer.rank <= 3 && getRankIcon(farmer.rank)}
                    <div>
                      <p className="font-medium text-foreground">
                        {farmer.isCurrentUser ? `You (${farmer.name})` : farmer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{farmer.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getLevelBadgeColor(farmer.level)}>
                    {farmer.level}
                  </Badge>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{farmer.points}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{leaderboard.length}</p>
            <p className="text-sm text-muted-foreground">Active Farmers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {leaderboard.reduce((sum, farmer) => sum + farmer.points, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Points Earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Medal className="h-8 w-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {Math.round(leaderboard.reduce((sum, farmer) => sum + farmer.points, 0) / leaderboard.length)}
            </p>
            <p className="text-sm text-muted-foreground">Average Points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
