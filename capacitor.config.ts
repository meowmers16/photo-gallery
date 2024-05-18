import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.renald.PhotoActivity',
  appName: 'Photo Activity',
  webDir: 'www',
  plugins: {
    LiveUpdates: {
      appId: 'a9d3fcd7',
      channel: 'Production',
      autoUpdateMethod: 'development',
      maxVersions: 2
    }
  }
};

export default config;



