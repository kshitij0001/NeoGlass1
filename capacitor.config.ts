import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neetcompanion.app',
  appName: 'NEET Study Companion',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      sound: "default",
      requestPermissions: true,
      scheduleOn: "device",
      channelId: "neet_study_reminders",
      channelName: "NEET Study Reminders",
      channelDescription: "Reminders for NEET study sessions and events",
      importance: "high",
      visibility: "public"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
