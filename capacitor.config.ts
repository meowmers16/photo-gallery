import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.renald.PhotoActivity',
  appName: 'PhotoActivity',
  webDir: 'www',
  plugins: {
    LiveUpdates: {
      appId: '888b1a81',
      channel: 'Production',
      autoUpdateMethod: 'none',
      maxVersions: 2
    }
  }
};

export default config;



