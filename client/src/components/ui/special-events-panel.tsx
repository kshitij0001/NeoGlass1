import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  testPersonalizedNotification, 
  showSpecialPopup, 
  getRandomMessage,
  getContextualMessage 
} from "@/lib/special-events";

export function SpecialEventsPanel() {
  const handleTestNotification = () => {
    testPersonalizedNotification();
  };

  const handleTestPopup = () => {
    showSpecialPopup();
  };

  const handleTestContextualMessage = () => {
    const message = getContextualMessage();
    alert(`Contextual message: ${message}`);
  };

  const handleTestRandomMessage = () => {
    const message = getRandomMessage('morning');
    alert(`Random morning message: ${message}`);
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
          onClick={handleTestContextualMessage}
          className="w-full neobrutalist-btn bg-[#caffbf] hover:bg-[#caffbf]/90 text-brutal-black justify-start"
        >
          💬 Test Contextual Message
        </Button>
        
        <Button
          onClick={handleTestRandomMessage}
          className="w-full neobrutalist-btn bg-[#fdffb6] hover:bg-[#fdffb6]/90 text-brutal-black justify-start"
        >
          🌅 Test Morning Message
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Features:</strong><br/>
          • October 24th popup with confetti (appears only once per day)<br/>
          • Personalized notifications every 2-6 hours<br/>
          • Context-aware messages based on time of day<br/>
          • 40+ custom bunny messages with emojis
        </p>
      </div>
    </Card>
  );
}