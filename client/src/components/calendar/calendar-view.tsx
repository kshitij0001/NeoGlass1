import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Plus, Target, Trash2, Check } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, subWeeks, addWeeks, subDays, addDays } from "date-fns";
import { useStore } from "@/store";
import { AddEventModal } from "./add-event-modal";
import { cn } from "@/lib/utils";
import { getSubjectColor, getDifficultyColor, getEventTypeColor } from "@/lib/colors";
import { useSwipe } from "@/hooks/use-swipe";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [dayDetailsDate, setDayDetailsDate] = useState<Date | undefined>();
  const [swipingCard, setSwipingCard] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const { getQueuedReviews, events, reviews: allReviews, deleteEvent, completeReview, snoozeReviewById, deleteReview } = useStore();

  const reviews = allReviews;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  // Create a proper calendar grid that includes leading and trailing days
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getReviewsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const matchingReviews = reviews.filter(review => {
      const reviewDateStr = review.dueDate.split('T')[0]; // Extract date part from ISO string
      return reviewDateStr === dateStr;
    });
    return matchingReviews;
  };

  // Generate future review dates for planning visualization
  const getFutureReviewsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const SRS_INTERVALS = [4, 7, 14, 28, 40]; // From lib/srs.ts
    const futureReviews: any[] = [];

    // For each active review, calculate its future intervals
    reviews.forEach(review => {
      const currentInterval = review.interval || 0;
      const currentDueDate = new Date(review.dueDate);

      // Generate future intervals from current position
      for (let i = currentInterval + 1; i < SRS_INTERVALS.length; i++) {
        // Calculate days from current due date to next interval
        const additionalDays = SRS_INTERVALS[i] - SRS_INTERVALS[currentInterval];
        const futureDate = new Date(currentDueDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
        futureDate.setHours(0, 0, 0, 0); // Set to midnight

        if (format(futureDate, 'yyyy-MM-dd') === dateStr) {
          futureReviews.push({
            ...review,
            id: `${review.id}-future-${i}`,
            dueDate: futureDate.toISOString(),
            interval: i,
            isFuture: true
          });
        }
      }
    });

    return futureReviews;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date.startsWith(dateStr));
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
    }
  };

  const handleDayClick = (date: Date) => {
    setDayDetailsDate(date);
    setIsDayDetailsOpen(true);
  };

  const handleAddEventFromDay = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailsOpen(false);
    setIsAddEventOpen(true);
  };

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
    setSwipingCard(null);
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

  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const formatViewTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between h-8">
        <h2 className="text-lg font-black text-brutal-black dark:text-white leading-8 min-h-[2rem]">
          {formatViewTitle()}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="neobrutalist-btn bg-white dark:bg-gray-800 p-2"
            onClick={() => navigate('prev')}
            data-testid="prev-period"
          >
            <ChevronLeft className="h-4 w-4 text-black dark:text-white" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="neobrutalist-btn bg-white dark:bg-gray-800 p-2"
            onClick={() => navigate('next')}
            data-testid="next-period"
          >
            <ChevronRight className="h-4 w-4 text-black dark:text-white" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="neobrutalist-btn bg-mustard hover:bg-mustard/90 p-2"
            onClick={() => setIsAddEventOpen(true)}
            data-testid="add-event-btn"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        {(['month', 'week', 'day'] as const).map((viewType) => (
          <Button
            key={viewType}
            variant={view === viewType ? "default" : "outline"}
            size="sm"
            className={cn(
              "neobrutalist-btn font-bold capitalize",
              view === viewType
                ? "bg-electric-blue text-brutal-black dark:text-white"
                : "bg-white dark:bg-gray-800 text-brutal-black dark:text-white"
            )}
            onClick={() => setView(viewType)}
            data-testid={`view-${viewType}`}
          >
            {viewType}
          </Button>
        ))}
      </div>

      {/* Calendar Grid */}
      {view === 'month' && (
        <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-2 rounded-xl">
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-600 dark:text-gray-400 p-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const reviewsForDay = getReviewsForDate(day);
              const futureReviewsForDay = getFutureReviewsForDate(day);
              const allReviewsForDay = [...reviewsForDay, ...futureReviewsForDay];
              const eventsForDay = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "calendar-cell w-full h-24 p-1 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex flex-col text-xs overflow-hidden",
                    isToday && "bg-mustard/20 border-mustard",
                    !isCurrentMonth && "opacity-40"
                  )}
                  onClick={() => handleDayClick(day)}
                  data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                >
                  <div className={cn(
                    "text-xs font-bold text-center flex-shrink-0",
                    isToday ? "text-brutal-black" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {format(day, 'd')}
                  </div>

                  {/* Enhanced review visualization */}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    {allReviewsForDay.slice(0, 3).map((review, index) => {
                      const subjectColor = getSubjectColor(review.subject);

                      // Difficulty colors for the side bar
                      const difficultyColor = getDifficultyColor(review.difficulty);

                      return (
                        <div
                          key={review.id}
                          className={cn(
                            "w-full h-3 flex rounded-none overflow-hidden",
                            review.isFuture && "opacity-60 border border-dashed border-gray-400"
                          )}
                          title={`${review.subject} - ${review.topic} (${review.difficulty})${review.isFuture ? ' - Future Review' : ''}`}
                        >
                          {/* Difficulty indicator bar on the left */}
                          <div className="w-0.5" style={{ backgroundColor: difficultyColor }}></div>
                          {/* Main subject-colored bar with topic name */}
                          <div
                            className="flex-1 text-white text-[10px] leading-3 text-center truncate px-1"
                            style={{ backgroundColor: subjectColor, fontSize: '9px' }}
                          >
                            {review.topic.slice(0, 15)}
                          </div>
                        </div>
                      );
                    })}

                    {reviewsForDay.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{reviewsForDay.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Event indicators as dots */}
                  {eventsForDay.length > 0 && (
                    <div className="flex justify-center space-x-1 mt-1">
                      {eventsForDay.slice(0, 3).map((event) => {
                        const eventColor = getEventTypeColor(event.type);

                        return (
                          <div
                            key={event.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: eventColor }}
                            title={`${event.title} (${event.type})${event.time ? ` at ${event.time}` : ''}`}
                          />
                        );
                      })}
                      {eventsForDay.length > 3 && (
                        <div className="text-xs text-purple-500">+</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week View */}
      {view === 'week' && (
        <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
          <div className="flex flex-col gap-2">
            {getWeekDays().map((day) => {
              const reviewsForDay = getReviewsForDate(day);
              const futureReviewsForDay = getFutureReviewsForDate(day);
              const allReviewsForDay = [...reviewsForDay, ...futureReviewsForDay];
              const eventsForDay = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    isToday && "bg-mustard/20 border-mustard"
                  )}
                  onClick={() => handleDayClick(day)}
                  data-testid={`week-day-${format(day, 'yyyy-MM-dd')}`}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      {format(day, 'EEE')}
                    </div>
                    <div className={cn(
                      "text-lg font-bold mb-2",
                      isToday ? "text-brutal-black" : "text-gray-700 dark:text-gray-300"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="space-y-1">
                    {allReviewsForDay.slice(0, 2).map((review) => {
                      const subjectColor = getSubjectColor(review.subject);

                      // Difficulty colors and heights
                      const difficultyColor = getDifficultyColor(review.difficulty);

                      return (
                        <div
                          key={review.id}
                          className={cn(
                            "w-full relative",
                            review.isFuture && "opacity-60"
                          )}
                          title={`${review.subject} - ${review.topic} (${review.difficulty})${review.isFuture ? ' - Future Review' : ''}`}
                        >
                          {/* Review content with overlay difficulty indicator */}
                          <div className={cn(
                            `w-full ${subjectColor} text-white text-xs px-2 py-1 rounded relative`,
                            review.isFuture && "border border-dashed border-gray-400"
                          )}>
                            {/* Difficulty indicator overlay on left */}
                            <div className={`absolute left-0 top-0 w-1 ${difficultyColor} h-full rounded-l`}></div>
                            <div className="truncate pl-2">{review.topic}</div>
                          </div>
                        </div>
                      );
                    })}
                    {allReviewsForDay.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{allReviewsForDay.length - 2}
                      </div>
                    )}
                  </div>

                  {/* Events as dots */}
                  <div className="flex space-x-1 mt-1">
                    {eventsForDay.slice(0, 3).map((event) => {
                      const eventColors = {
                        exam: "bg-[#ff9999]", // Light coral
                        mock: "bg-[#b3d9ff]", // Light blue
                        holiday: "bg-[#ffeb9c]", // Light yellow
                        other: "bg-[#d4a4eb]" // Light purple
                      };
                      const eventColor = eventColors[event.type as keyof typeof eventColors] || "bg-[#d4a4eb]";

                      return (
                        <div
                          key={event.id}
                          className={`w-2 h-2 ${eventColor} rounded-full`}
                          title={`${event.title} (${event.type})`}
                        />
                      );
                    })}
                    {eventsForDay.length > 3 && (
                      <div className="text-xs text-gray-500">+{eventsForDay.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Day View */}
      {view === 'day' && (
        <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-black text-brutal-black dark:text-white">
                {format(currentDate, 'EEEE')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {format(currentDate, 'MMMM d, yyyy')}
              </p>
            </div>

            {/* Reviews for the day */}
            <div>
              <h4 className="font-bold text-brutal-black dark:text-white mb-2">Reviews</h4>
              {(() => {
                const currentReviews = getReviewsForDate(currentDate);
                const futureReviews = getFutureReviewsForDate(currentDate);
                const allReviews = [...currentReviews, ...futureReviews];
                return allReviews.length > 0 ? (
                  <div className="space-y-2">
                    {allReviews.map((review) => {
                      const color = getSubjectColor(review.subject);

                      return (
                        <div
                          key={review.id}
                          className={cn(
                            `p-3 rounded-lg ${color} text-white`,
                            review.isFuture && "opacity-70 border-2 border-dashed border-gray-300"
                          )}
                        >
                          <div className="font-bold">
                            {review.topic}
                            {review.isFuture && <span className="ml-2 text-xs">(Future Review)</span>}
                          </div>
                          <div className="text-sm opacity-90">{review.chapter} • {review.subject}</div>
                          <div className="text-xs mt-1 flex items-center">
                            <span className="mr-1">Difficulty:</span>
                            <span className={`px-2 py-0.5 rounded text-black font-bold`}
                              style={{ backgroundColor: getDifficultyColor(review.difficulty) }}
                            >
                              {review.difficulty}
                            </span>
                            {review.isFuture && (
                              <span className="ml-2 text-xs opacity-75">
                                SRS Interval {review.interval + 1}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-black dark:text-white text-center py-4">
                    No reviews scheduled for this day
                  </div>
                );
              })()}
            </div>

            {/* Events for the day */}
            <div>
              <h4 className="font-bold text-brutal-black dark:text-white mb-2">Events</h4>
              {getEventsForDate(currentDate).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(currentDate).map((event) => {
                    const eventColors = {
                      exam: "bg-[#ff9999]", // Light coral
                      mock: "bg-[#b3d9ff]", // Light blue
                      holiday: "bg-[#ffeb9c]", // Light yellow
                      other: "bg-[#d4a4eb]" // Light purple
                    };
                    const eventColor = eventColors[event.type as keyof typeof eventColors] || "bg-[#d4a4eb]";

                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg ${eventColor} text-black relative`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-bold">{event.title}</div>
                            <div className="text-sm opacity-90 capitalize">{event.type}</div>
                            {event.time && (
                              <div className="text-sm font-semibold opacity-90">🕐 {event.time}</div>
                            )}
                            {event.description && (
                              <div className="text-xs mt-1 opacity-80">{event.description}</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => deleteEvent(event.id)}
                            data-testid={`delete-event-${event.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-black dark:text-white text-center py-4">
                  No events scheduled for this day
                </div>
              )}
            </div>

            <Button
              className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 p-3 rounded-xl font-bold text-brutal-black"
              onClick={() => handleDayClick(currentDate)}
              data-testid="add-event-day-view"
            >
              Add Event for This Day
            </Button>
          </div>
        </Card>
      )}

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        selectedDate={selectedDate}
      />

      {/* Day Details Modal */}
      <Dialog open={isDayDetailsOpen} onOpenChange={setIsDayDetailsOpen}>
        <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-md mx-auto max-h-[85vh] overflow-y-auto text-[#211f1f]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
              {dayDetailsDate && format(dayDetailsDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription className="text-sm dark:text-gray-400 text-[#080505] font-bold">
              View reviews and events for this day
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Reviews for the day */}
            <div>
              <h4 className="font-bold text-brutal-black dark:text-white mb-2">Reviews</h4>
              {dayDetailsDate && getReviewsForDate(dayDetailsDate).length > 0 ? (
                <div className="space-y-2">
                  {getReviewsForDate(dayDetailsDate).map((review) => (
                    <SwipeableReviewCard
                      key={review.id}
                      review={review}
                      isSwipingCard={swipingCard === review.id}
                      onSwipeRight={() => handleSwipeRight(review.id)}
                      onSwipeDown={() => handleSwipeDown(review.id)}
                      onSwipeLeft={() => handleSwipeLeft(review.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-black dark:text-white text-center py-4">
                  No reviews scheduled for this day
                </div>
              )}
            </div>

            {/* Events for the day */}
            <div>
              <h4 className="font-bold text-brutal-black dark:text-white mb-2">Events</h4>
              {dayDetailsDate && getEventsForDate(dayDetailsDate).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(dayDetailsDate).map((event) => {
                    const eventColors = {
                      exam: "bg-[#ff9999]", // Light coral
                      mock: "bg-[#b3d9ff]", // Light blue
                      holiday: "bg-[#ffeb9c]", // Light yellow
                      other: "bg-[#d4a4eb]" // Light purple
                    };
                    const eventColor = eventColors[event.type as keyof typeof eventColors] || "bg-[#d4a4eb]";

                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg ${eventColor} text-black`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-bold">{event.title}</div>
                            <div className="text-sm opacity-90 capitalize">{event.type}</div>
                            {event.time && (
                              <div className="text-sm font-semibold opacity-90">🕐 {event.time}</div>
                            )}
                            {event.description && (
                              <div className="text-xs mt-1 opacity-80">{event.description}</div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => deleteEvent(event.id)}
                            data-testid={`delete-event-modal-${event.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-black dark:text-white text-center py-4">
                  No events scheduled for this day
                </div>
              )}
            </div>

            <Button
              className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 p-3 rounded-xl font-bold text-brutal-black"
              onClick={() => dayDetailsDate && handleAddEventFromDay(dayDetailsDate)}
              data-testid="add-event-from-day"
            >
              Add Event for This Day
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

interface SwipeableReviewCardProps {
  review: any;
  isSwipingCard: boolean;
  onSwipeRight: () => void;
  onSwipeDown: () => void;
  onSwipeLeft: () => void;
}

function SwipeableReviewCard({
  review,
  isSwipingCard,
  onSwipeRight,
  onSwipeDown,
  onSwipeLeft,
}: SwipeableReviewCardProps) {
  const subjectColor = getSubjectColor(review.subject);
  const difficultyColor = getDifficultyColor(review.difficulty);
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
    
    setTimeout(async () => {
      try {
        await action();
      } finally {
        setIsPerformingAction(false);
      }
    }, 150);
  };

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
    <div
      ref={(element) => element && attachSwipeListeners(element)}
      className={cn(
        "p-3 rounded-lg text-white neobrutalist-card border-4 border-brutal-black dark:border-white relative overflow-hidden",
        "touch-pan-y select-none transition-all duration-200",
        isSwipingCard && "opacity-50 scale-95",
        isPerformingAction && "card-swiping",
        getSwipeClass()
      )}
      style={{ 
        backgroundColor: subjectColor,
        ...getSwipeStyle()
      }}
    >
      <div className="font-bold">{review.topic}</div>
      <div className="text-sm opacity-90">{review.chapter} • {review.subject}</div>
      <div className="text-xs mt-1 flex items-center">
        <span className="mr-1">Difficulty:</span>
        <span className="px-2 py-0.5 rounded text-black font-bold"
          style={{ backgroundColor: difficultyColor }}
        >
          {review.difficulty}
        </span>
      </div>

      {/* Swipe indicators */}
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
          className="text-xs font-bold text-center mt-1 text-white px-2 py-1 rounded"
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
        <div className="text-xs font-bold text-center mt-1 text-white bg-red-500 px-2 py-1 rounded">
          Delete
        </div>
      </div>
    </div>
  );
}