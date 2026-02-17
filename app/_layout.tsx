import {SplashScreen, Stack} from "expo-router";
import './global.css';
import {useFonts} from "expo-font";
import {useContext, useEffect} from "react";
import { AuthContext, AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const [fontsLoad, error] = useFonts({
    'QuickSand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'QuickSand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'QuickSand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'QuickSand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'QuickSand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoad) SplashScreen.hideAsync();
  }, [fontsLoad, error]);

  if (!fontsLoad && !error) return null;

  // 1. Wrap EVERYTHING in the Provider here
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// 2. This component is now a CHILD of AuthProvider, so useContext will work!
function AppContent() {
  const { isLogged, loading } = useContext(AuthContext);

  // Prevent flickering while checking SecureStore
  if (loading) return null; 

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Note: 'Stack.Protected' is not a standard Expo Router component. 
          Standard practice is to conditionally render or use a Redirect.
          I am keeping your logic style below: 
      */}
      <Stack.Screen 
        name="(tabs)" 
        redirect={!isLogged} // Common Expo Router pattern
      />
      <Stack.Screen 
        name="(auth)" 
        redirect={isLogged} 
      />
    </Stack>
  );
}