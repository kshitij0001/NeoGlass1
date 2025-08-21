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
      channelId: "neet-reminders"
    },
  }
};

export default config;
