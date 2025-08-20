import { getDailyQuote } from "@/data/motivation-quotes";

export function StickyMotivationBar() {
  const quote = getDailyQuote();

  return (
    <div className="sticky top-0 z-50 wavy-bg">
      <div className="glass-morphism p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-cream-6 text-lg font-bold">"</span>
            <p className="text-sm font-bold text-dark-text dark:text-white line-clamp-2" data-testid="motivation-quote">
              {quote}
            </p>
            <span className="text-cream-6 text-lg font-bold">"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
