
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1e008a3d1f47456983bfd639684a175f',
  appName: 'habit-sphere-54',
  webDir: 'dist',
  server: {
    url: 'https://1e008a3d-1f47-4569-83bf-d639684a175f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: true,
      spinnerColor: '#4f46e5',
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;
