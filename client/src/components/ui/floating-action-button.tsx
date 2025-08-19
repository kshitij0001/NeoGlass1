import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({ 
  onClick, 
  className,
  children = <Plus className="h-6 w-6" />
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full",
        "bg-cream-6 hover:bg-cream-6/90 text-dark-text",
        "neobrutalist-btn hover:animate-fab-pulse",
        "shadow-soft border border-gray-200 dark:border-gray-700",
        className
      )}
      data-testid="fab-quick-add"
    >
      {children}
    </Button>
  );
}
