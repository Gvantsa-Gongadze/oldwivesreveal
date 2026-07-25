import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oldwivesreveal.app',
  appName: "Old Wives' Reveal",
  webDir: 'dist',
  server: {
    url: 'http://192.168.100.15:5173',
    cleartext: true,
  },
};

export default config;
