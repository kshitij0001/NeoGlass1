import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useStore } from "@/store";
import { parseISO, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Calendar, Clock, Target } from "lucide-react";

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
}

export function NeetCountdown() {
  const { settings, customColors } = useStore();
  const [countdown, setCountdown] = useState<CountdownData>({ days: 0, hours: 0, minutes: 0 });

  // Debug: Log current color value
  console.log('🟡 Countdown card color from store:', customColors.cards.countdown);
  console.log('🟡 Full customColors object:', customColors);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const neetDate = parseISO(settings.neetDate);

      const days = Math.max(0, differenceInDays(neetDate, now));
      const hours = Math.max(0, differenceInHours(neetDate, now) % 24);
      const minutes = Math.max(0, differenceInMinutes(neetDate, now) % 60);

      setCountdown({ days, hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [settings.neetDate]);

  return (
    <Card
      className="neobrutalist-card p-4 rounded-xl relative overflow-hidden group hover:scale-105 transition-transform duration-200"
      style={{ backgroundColor: customColors.cards.countdown }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-orange-400/30"></div>
      <div className="text-center relative z-10">
        <h2 className="text-2xl font-black mb-2" data-testid="countdown-title">
          NEET 2026
        </h2>
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-black" data-testid="countdown-days">
              {countdown.days}
            </div>
            <div className="text-xs font-bold">DAYS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black" data-testid="countdown-hours">
              {countdown.hours}
            </div>
            <div className="text-xs font-bold">HRS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black" data-testid="countdown-minutes">
              {countdown.minutes}
            </div>
            <div className="text-xs font-bold">MIN</div>
          </div>
        </div>
      </div>
    </Card>
  );
}