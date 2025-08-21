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
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#F59E0B",
      sound: "default",
    },
  }
};

export default config;
