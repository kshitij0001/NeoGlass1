import { Home, Calendar, Menu, BookOpen, FlaskConical, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useState } from "react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  onNavigate: (path: string) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHidden = scrollDirection === 'down' && scrollY > 100;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Overlay - blurs entire page */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-30"
          onClick={() => setIsMenuOpen(false)}
          data-testid="menu-overlay"
        />
      )}

      {/* Bottom Navigation */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 transition-transform duration-300",
          isMenuOpen ? "z-50" : "z-50",
          isHidden ? "translate-y-full" : "translate-y-0"
        )}
        data-testid="bottom-navigation"
      >
        <div className="glass-morphism border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-sm mx-auto px-4 py-3">
            <div className="flex justify-around items-center w-full">
              {/* Dashboard */}
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 p-3 h-auto min-w-0 flex-1",
                  location === "/" ? "text-dark-text dark:text-white" : "text-gray-600 dark:text-gray-400"
                )}
                onClick={() => handleNavigate("/")}
                data-testid="nav-dashboard"
              >
                <Home className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold leading-tight">Dashboard</span>
              </Button>

              {/* Calendar */}
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 p-3 h-auto min-w-0 flex-1",
                  location === "/calendar" ? "text-dark-text dark:text-white" : "text-gray-600 dark:text-gray-400"
                )}
                onClick={() => handleNavigate("/calendar")}
                data-testid="nav-calendar"
              >
                <Calendar className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold leading-tight">Calendar</span>
              </Button>

              {/* Hamburger Menu */}
              <div className="relative flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 h-auto w-full text-gray-600 dark:text-gray-400"
                  )}
                  onClick={toggleMenu}
                  data-testid="nav-hamburger"
                >
                  <Menu className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">Menu</span>
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Menu - slides up from bottom */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0",
          "glass-morphism border-t border-gray-200 dark:border-gray-700 p-6 pb-24 rounded-t-2xl",
          "w-full z-40",
          "transition-transform duration-300 ease-out",
          isMenuOpen 
            ? "translate-y-0" 
            : "translate-y-full"
        )}
        data-testid="hamburger-menu"
      >
        <div className="max-w-sm mx-auto">
          <h3 className="text-lg font-bold text-center mb-4 text-dark-text dark:text-white">Navigation</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { path: "/plan", icon: BookOpen, label: "Study Plan", testId: "nav-plan" },
              { path: "/tests", icon: FlaskConical, label: "Practice Tests", testId: "nav-tests" },
              { path: "/progress", icon: TrendingUp, label: "Progress", testId: "nav-progress" },
              { path: "/settings", icon: Settings, label: "Settings", testId: "nav-settings" }
            ].map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-2 p-4 h-auto min-w-0 rounded-xl border border-gray-200 dark:border-gray-700",
                  location === item.path ? "text-dark-text dark:text-white bg-white/50 dark:bg-gray-800/50" : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-800/30"
                )}
                onClick={() => handleNavigate(item.path)}
                data-testid={item.testId}
              >
                <item.icon className="h-6 w-6 shrink-0" />
                <span className="text-sm font-bold leading-tight text-center">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}