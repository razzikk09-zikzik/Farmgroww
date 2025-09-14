import { Link, useLocation } from "wouter";
import { Home, BookOpen, Flag, TrendingUp, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home", testId: "nav-home" },
  { path: "/lessons", icon: BookOpen, label: "Lessons", testId: "nav-lessons" },
  { path: "/challenges", icon: Flag, label: "Challenges", testId: "nav-challenges" },
  { path: "/market", icon: TrendingUp, label: "Market", testId: "nav-market" },
  { path: "/leaderboard", icon: User, label: "Profile", testId: "nav-profile" },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label, testId }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button 
                className={`flex flex-col items-center py-2 px-4 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                } transition-colors`}
                data-testid={testId}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
