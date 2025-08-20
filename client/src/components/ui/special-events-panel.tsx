import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  testPersonalizedNotification, 
  showSpecialPopup, 
  sendPersonalizedNotificationNow,
  getRandomMorningMessage,
  getRandomDaytimeMessage 
} from "@/lib/special-events";

export function SpecialEventsPanel() {
  const handleTestNotification = () => {
    sendPersonalizedNotificationNow();
  };

  const handleTestPopup = () => {
    showSpecialPopup();
  };

  const handleTestMorningMessage = () => {
    const message = getRandomMorningMessage();
    alert(`Morning message: ${message}`);
  };

  const handleTestRandomMessage = () => {
    const message = getRandomDaytimeMessage();
    alert(`Random daytime message: ${message}`);
  };

  return (
    <Card className="neobrutalist-card bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
      <h3 className="text-lg font-black text-brutal-black dark:text-white mb-4">
        🎉 Special Events Testing
      </h3>
      <div className="space-y-3">
        <Button
          onClick={handleTestNotification}
          className="w-full neobrutalist-btn bg-[#ffc6ff] hover:bg-[#ffc6ff]/90 text-brutal-black justify-start"
        >
          🔔 Test Personalized Notification
        </Button>

        <Button
          onClick={handleTestPopup}
          className="w-full neobrutalist-btn bg-[#a0c4ff] hover:bg-[#a0c4ff]/90 text-brutal-black justify-start"
        >
          🎊 Test October 24th Popup
        </Button>

        <Button
          onClick={handleTestMorningMessage}
          className="w-full neobrutalist-btn bg-[#caffbf] hover:bg-[#caffbf]/90 text-brutal-black justify-start"
        >
          🌅 Test Morning Message
        </Button>

        <Button
          onClick={handleTestRandomMessage}
          className="w-full neobrutalist-btn bg-[#fdffb6] hover:bg-[#fdffb6]/90 text-brutal-black justify-start"
        >
          💬 Test Random Message
        </Button>

        <Button
          onClick={() => (window as any).testOfflineNotification?.()}
          className="w-full neobrutalist-btn bg-[#90ab98] hover:bg-[#90ab98]/90 text-brutal-black justify-start"
        >
          📡 Test Offline Notification (5s)
        </Button>

        <Button
          onClick={() => {
            (window as any).clearNotificationSpam?.();
            // Also force refresh the page to restart clean
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
          className="w-full neobrutalist-btn bg-[#ff9770] hover:bg-[#ff9770]/90 text-brutal-black justify-start"
        >
          🛑 STOP All Notifications & Refresh
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          • October 24th popup with confetti (appears only once per day)<br/>
          • Morning notification at 6:00 AM daily (max 1 per day)<br/>
          • One random notification between 9 AM - 6 PM (max 1 per day)<br/>
          • 50+ custom bunny messages with emojis<br/>
          • <strong>Now works offline!</strong> Notifications delivered via Service Worker<br/>
          • Fixed spam issue - use orange button if notifications get stuck<br/>
          • Easy editing in special-events.ts file
        </p>
      </div>
    </Card>
  );
}