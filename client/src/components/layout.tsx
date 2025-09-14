import Header from "./header";
import MobileNav from "./mobile-nav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 lg:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
