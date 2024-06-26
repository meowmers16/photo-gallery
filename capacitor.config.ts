import { Capacitor } from '@capacitor/core';
import { CapacitorConfig } from '@capacitor/cli';
import * as LiveUpdates from '@capacitor/live-updates';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { myApi } from './my-api'; // Ensure this path is correct

// Capacitor configuration
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
    },
    SplashScreen: {
      launchAutoHide: false
    }
  }
};

export default config;

// Initialize app with LiveUpdates
async function initializeApp() {
  // Check the platform
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    console.warn('LiveUpdates not implemented for web platform.');
    await SplashScreen.hide();
    return;
  }

  // Log the user in and get their Live Updates config details from the backend
  const loggedInUser = await myApi.login();

  // Dynamically set the channel and max versions
  await LiveUpdates.setConfig({
    channel: loggedInUser.channel,  // could be beta, production, etc.
    maxVersions: loggedInUser.maxVersions
  });

  // Retrieve the latest Live Update based on the user-specific configuration
  await LiveUpdates.sync();

  // Check for reload condition on app start
  if (
    localStorage['shouldReloadApp'] === 'true' &&
    localStorage['shouldBlockReload'] === 'false'
  ) {
    await LiveUpdates.reload();
  }

  // Register event to fire each time user resumes the app  
  App.addListener('resume', async () => {
    if (localStorage['shouldReloadApp'] === 'true') {
      await LiveUpdates.reload();
    } else {
      const result = await LiveUpdates.sync();
      localStorage['shouldReloadApp'] = result.activeApplicationPathChanged.toString();
    }
  });

  // First sync on app load and hide SplashScreen
  const result = await LiveUpdates.sync();
  if (result.activeApplicationPathChanged) {
    await LiveUpdates.reload();
  } else {
    await SplashScreen.hide();
  }
}

// Call the initialize function
initializeApp();

// Custom Authentication Service
class AuthService {
  public async login() {
    localStorage['shouldBlockReload'] = 'true';
    // Custom login logic here
    localStorage['shouldBlockReload'] = 'false';
  }
}

// Export an instance of AuthService
export const authService = new AuthService();

