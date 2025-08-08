// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Login page - first screen */}
        <Stack.Screen
          name="(tabs)/login"
          options={{ headerShown: false }}
        />
        {/* Home page */}
        <Stack.Screen
          name="(tabs)/home"
          options={{ title: 'Home', headerShown: false }}
        />
        {/* Profile details */}
        <Stack.Screen
          name="(tabs)/profile"
          options={{ title: 'Profile Details' }}
        />
        {/* Map screen */}
        <Stack.Screen
          name="(tabs)/map"
          options={{ title: 'Bus Location' }}
        />
        {/* Not found fallback */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
