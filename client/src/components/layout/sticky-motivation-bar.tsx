import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDailyQuote } from "@/data/motivation-quotes";
import { useStore } from "@/store";

export function StickyMotivationBar() {
  const { settings, updateTheme } = useStore();
  const quote = getDailyQuote();

  const toggleTheme = () => {
    updateTheme(settings.theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="sticky top-0 z-50 wavy-bg">
      <div className="glass-morphism p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-cream-6 text-lg font-bold">"</span>
            <p className="text-sm font-bold text-dark-text dark:text-white line-clamp-2" data-testid="motivation-quote">
              {quote}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="neobrutalist-btn bg-cream-6 hover:bg-cream-6/90 p-2 rounded-full ml-2 flex-shrink-0"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {settings.theme === 'light' ? (
              <Moon className="h-4 w-4 text-dark-text" />
            ) : (
              <Sun className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
