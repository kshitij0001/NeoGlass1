import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Trash2 } from "lucide-react";
import { useStore } from "@/store";
import { useSwipe } from "@/hooks/use-swipe";
import { useState } from "react";
import { isOverdue, isDueToday } from "@/lib/srs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSubjectColor, getDifficultyColor, getSubjectContrastColor, getDifficultyContrastColor } from "@/lib/colors";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { triggerAllClearConfetti } from "@/lib/confetti";



export function SRSQueue() {
  const { getQueuedReviews, completeReview, snoozeReviewById, deleteReview, getReviewStats } = useStore();
  const [swipingCard, setSwipingCard] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const reviews = getQueuedReviews().slice(0, 10); // Show first 10
  const stats = getReviewStats();

  const handleSwipeRight = async (reviewId: string) => {
    setSwipingCard(reviewId);
    try {
      await completeReview(reviewId);
    } catch (error) {
      console.error('Error completing review:', error);
    } finally {
      setSwipingCard(null);
    }
  };

  const handleSwipeDown = async (reviewId: string) => {
    setSwipingCard(reviewId);
    try {
      await snoozeReviewById(reviewId, 1);
    } catch (error) {
      console.error('Error snoozing review:', error);
    } finally {
      setSwipingCard(null);
    }
  };

  const handleSwipeLeft = async (reviewId: string) => {
    setSwipingCard(null); // Reset swiping state
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    
    try {
      await deleteReview(reviewToDelete);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleCompleteClick = async (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleSwipeRight(reviewId);
  };

  const handleSnoozeClick = async (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleSwipeDown(reviewId);
  };

  const getStatusBadge = (review: any) => {
    if (isOverdue(review)) {
      return <Badge className="bg-red-500 text-white">OVERDUE</Badge>;
    }
    if (isDueToday(review)) {
      return <Badge className="bg-green-500 text-white">DUE TODAY</Badge>;
    }
    return <Badge className="bg-blue-500 text-white">UPCOMING</Badge>;
  };

  const getRelativeDate = (review: any) => {
    if (isOverdue(review)) {
      const days = Math.abs(Math.floor((new Date().getTime() - new Date(review.dueDate).getTime()) / (1000 * 60 * 60 * 24)));
      return `Due ${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    if (isDueToday(review)) {
      return "Due today";
    }
    
    // Check if it's actually tomorrow
    const dueDate = new Date(review.dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return "Due tomorrow";
    }
    
    // Shouldn't happen with new filtering, but fallback
    return "Due later";
  };

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-brutal-black dark:text-white">Today's Reviews</h3>
          <Badge 
            className="text-brutal-black dark:text-black border-2 border-brutal-black dark:border-white cursor-pointer hover:scale-105 transition-transform duration-200 select-none" 
            style={{ backgroundColor: '#fce7a5' }}
            onClick={triggerAllClearConfetti}
            title="Click for celebration! 🎉"
          >
            All caught up! 🎉
          </Badge>
        </div>
        <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-8 rounded-xl text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h4 className="font-bold text-brutal-black dark:text-white mb-2">Great job!</h4>
          <p className="text-gray-600 dark:text-gray-400">No reviews due right now. Keep up the excellent work!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-brutal-black dark:text-white">Today's Reviews</h3>
        <Badge className="text-brutal-black dark:text-black border-2 border-brutal-black dark:border-white" data-testid="reviews-remaining" style={{ backgroundColor: stats.overdue + stats.dueToday === 0 ? '#FFE55C' : '#FF8A8A' }}>
          {stats.overdue + stats.dueToday === 0 ? '🎉 All caught up!' : `${stats.overdue + stats.dueToday} remaining`}
        </Badge>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isSwipingCard={swipingCard === review.id}
            onSwipeRight={() => handleSwipeRight(review.id)}
            onSwipeDown={() => handleSwipeDown(review.id)}
            onSwipeLeft={() => handleSwipeLeft(review.id)}
            onComplete={handleCompleteClick}
            onSnooze={handleSnoozeClick}
            onDelete={deleteReview}
            getStatusBadge={getStatusBadge}
            getRelativeDate={getRelativeDate}
          />
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="neobrutalist-card bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brutal-black dark:text-white">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this review? This action cannot be undone and you'll lose all progress for this topic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="neobrutalist-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="neobrutalist-btn bg-red-500 text-white border-2 border-brutal-black dark:border-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ReviewCardProps {
  review: any;
  isSwipingCard: boolean;
  onSwipeRight: () => void;
  onSwipeDown: () => void;
  onSwipeLeft: () => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
  onSnooze: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => Promise<void>;
  getStatusBadge: (review: any) => JSX.Element;
  getRelativeDate: (review: any) => string;
}

function ReviewCard({
  review,
  isSwipingCard,
  onSwipeRight,
  onSwipeDown,
  onSwipeLeft,
  onComplete,
  onSnooze,
  onDelete,
  getStatusBadge,
  getRelativeDate,
}: ReviewCardProps) {
  const subjectColor = getSubjectColor(review.subject);
  const subjectContrastColor = getSubjectContrastColor(review.subject);
  const difficultyColor = getDifficultyColor(review.difficulty);
  const difficultyContrastColor = getDifficultyContrastColor(review.difficulty);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const handleSwipeMove = (direction: 'left' | 'right' | 'up' | 'down' | null, progress: number) => {
    setSwipeDirection(direction);
    setSwipeProgress(progress);
  };

  const handleSwipeComplete = async (action: () => void) => {
    if (isPerformingAction) return;
    
    setIsPerformingAction(true);
    setSwipeDirection(null);
    setSwipeProgress(0);
    
    // Add a small delay for visual feedback
    setTimeout(async () => {
      try {
        await action();
      } finally {
        setIsPerformingAction(false);
      }
    }, 150);
  };

  // Always call useSwipe hook to maintain consistent hook order
  const { attachSwipeListeners } = useSwipe({
    onSwipedRight: () => handleSwipeComplete(onSwipeRight),
    onSwipedDown: () => handleSwipeComplete(onSwipeDown),
    onSwipedLeft: () => handleSwipeComplete(onSwipeLeft),
    onSwipeMove: handleSwipeMove,
    delta: 80
  });

  const getSwipeClass = () => {
    if (!swipeDirection || swipeProgress === 0) return '';
    
    switch (swipeDirection) {
      case 'right':
        return 'swipe-feedback right';
      case 'left':
        return 'swipe-feedback left';
      case 'down':
        return 'swipe-feedback down';
      default:
        return '';
    }
  };

  const getSwipeStyle = () => {
    if (!swipeDirection || swipeProgress === 0) return {};
    
    const maxDistance = 50;
    const distance = swipeProgress * maxDistance;
    
    switch (swipeDirection) {
      case 'right':
        return { 
          transform: `translateX(${distance}px)`,
          opacity: 1 - (swipeProgress * 0.3)
        };
      case 'left':
        return { 
          transform: `translateX(-${distance}px)`,
          opacity: 1 - (swipeProgress * 0.3)
        };
      case 'down':
        return { 
          transform: `translateY(${distance}px)`,
          opacity: 1 - (swipeProgress * 0.3)
        };
      default:
        return {};
    }
  };

  return (
    <Card
      ref={(element) => element && attachSwipeListeners(element)}
      className={cn(
        "neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl relative overflow-hidden",
        "touch-pan-y select-none transition-all duration-200",
        isSwipingCard && "opacity-50 scale-95",
        isPerformingAction && "card-swiping",
        getSwipeClass()
      )}
      style={getSwipeStyle()}
      data-testid={`review-card-${review.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: subjectColor }}
            ></div>
            <span className="text-xs font-bold text-dark-text dark:text-white">
              {review.subject}
            </span>
            {getStatusBadge(review)}
          </div>
          <h4 className="font-black text-dark-text dark:text-white mb-1" data-testid={`review-topic-${review.id}`}>
            {review.topic}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`review-chapter-${review.id}`}>
            {review.chapter}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge 
              className="font-bold border border-gray-300 dark:border-gray-600"
              style={{ 
                backgroundColor: difficultyColor,
                color: difficultyContrastColor
              }}
            >
              {review.difficulty}
            </Badge>
            <span className="text-xs text-gray-600 dark:text-gray-400" data-testid={`review-due-${review.id}`}>
              {getRelativeDate(review)}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          <Button
            size="sm"
            className="neobrutalist-btn text-white p-2 rounded-lg border-2 border-brutal-black dark:border-white hover:scale-105 transition-transform"
            style={{ backgroundColor: '#90EE90' }}
            onClick={(e) => onComplete(review.id, e)}
            data-testid={`complete-review-${review.id}`}
            disabled={isPerformingAction}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="neobrutalist-btn text-white p-2 rounded-lg border-2 border-brutal-black dark:border-white hover:scale-105 transition-transform"
            style={{ backgroundColor: '#4A90E2' }}
            onClick={(e) => onSnooze(review.id, e)}
            data-testid={`snooze-review-${review.id}`}
            disabled={isPerformingAction}
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Swipe indicators with enhanced visibility */}
      <div className={cn(
        "absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200",
        swipeDirection === 'right' && swipeProgress > 0.2 ? "opacity-100 scale-110" : "opacity-0"
      )}>
        <div 
          className="p-3 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: '#90EE90' }}
        >
          <Check className="h-5 w-5 text-white" />
        </div>
        <div 
          className="text-xs font-bold text-center mt-1 text-white px-2 py-1 rounded"
          style={{ backgroundColor: '#90EE90' }}
        >
          Done
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none transition-all duration-200",
        swipeDirection === 'down' && swipeProgress > 0.2 ? "opacity-100 scale-110" : "opacity-0"
      )}>
        <div 
          className="p-3 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: '#4A90E2' }}
        >
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div 
          className="text-xs font-bold text-center mt-1 text-white px-2 py-1 rounded-full"
          style={{ backgroundColor: '#4A90E2' }}
        >
          Snooze
        </div>
      </div>
      
      <div className={cn(
        "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200",
        swipeDirection === 'left' && swipeProgress > 0.2 ? "opacity-100 scale-110" : "opacity-0"
      )}>
        <div className="bg-red-500 p-3 rounded-full border-2 border-white shadow-lg">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <div className="text-xs font-bold text-center mt-1 text-white bg-red-500 px-2 py-1 rounded-full">
          Delete
        </div>
      </div>
    </Card>
  );
}