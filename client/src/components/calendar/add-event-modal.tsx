import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useStore } from "@/store";
import { format } from "date-fns";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export function AddEventModal({ isOpen, onClose, selectedDate }: AddEventModalProps) {
  const { addEvent } = useStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"exam" | "mock" | "holiday" | "other">("other");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [eventTime, setEventTime] = useState("09:00");

  // Update eventDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setEventDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    addEvent({
      title: title.trim(),
      date: eventDate,
      type,
      description: description.trim() || undefined,
      time: eventTime,
    });

    // Trigger notification scheduler to refresh and schedule the new event
    try {
      const { notificationScheduler } = await import('@/lib/notification-scheduler');
      await notificationScheduler.scheduleEventNotifications();
      console.log('📅 Event created and notification scheduled successfully');
    } catch (error) {
      console.error('❌ Error scheduling notification for new event:', error);
    }

    // Reset form
    setTitle("");
    setType("other");
    setDescription("");
    setEventDate(format(new Date(), 'yyyy-MM-dd'));
    setEventTime("09:00");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setType("other");
    setDescription("");
    setEventDate(format(new Date(), 'yyyy-MM-dd'));
    setEventTime("09:00");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-morphism border-4 border-brutal-black dark:border-white rounded-3xl max-w-sm mx-auto text-[#000000]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-brutal-black dark:text-white">
            Add Event
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Add a new event to your calendar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Event Title
            </Label>
            <Input
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-3 border-brutal-black dark:border-white bg-white dark:bg-gray-800 font-bold"
              data-testid="event-title-input"
            />
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Date
            </Label>
            <Input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border-3 border-brutal-black dark:border-white bg-white dark:bg-gray-800 font-bold"
              data-testid="event-date-input"
            />
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Time
            </Label>
            <Input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full border-3 border-brutal-black dark:border-white bg-white dark:bg-gray-800 font-bold"
              data-testid="event-time-input"
            />
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Event Type
            </Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger className="w-full border-3 border-brutal-black dark:border-white bg-white dark:bg-gray-800 font-bold text-black dark:text-white" data-testid="event-type-select">
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="mock">Mock Test</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-bold text-brutal-black dark:text-white mb-2">
              Description (Optional)
            </Label>
            <Textarea
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-3 border-brutal-black dark:border-white bg-white dark:bg-gray-800 font-bold resize-none"
              rows={3}
              data-testid="event-description-input"
            />
          </div>

          <Button
            className="w-full neobrutalist-btn bg-mustard hover:bg-mustard/90 p-4 rounded-xl font-black text-brutal-black text-lg"
            onClick={handleSubmit}
            disabled={!title.trim() || !type}
            data-testid="submit-event"
          >
            Add Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}