import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'zw.co.wii.farmer',
  appName: 'WII Farmer',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#060f08',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#060f08',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
