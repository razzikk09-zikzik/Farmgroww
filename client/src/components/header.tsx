import { Bell, Sprout, User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="text-primary-foreground h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-foreground">FarmGrow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell 
                className="text-muted-foreground h-6 w-6 cursor-pointer hover:text-foreground transition-colors" 
                data-testid="notification-bell"
              />
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <User className="text-secondary-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
