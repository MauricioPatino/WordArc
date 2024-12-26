import { Stack, useRouter } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
import { tokenCache } from '../utils/cache';
import { GestureHandlerRootView } from "react-native-gesture-handler";

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function RootLayout() {
  const router = useRouter();
  return (
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <ClerkLoaded>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{
         headerShown: true,
          headerTitle: 'Login',
          headerTintColor: 'black',
          headerStyle: { backgroundColor: 'white' }
         }} />
      <Stack.Screen name="game" options={{ 
        headerBackTitle: 'WordArc',
        headerShown: true,
        headerTitle: 'WordArc',

        headerTintColor: 'black',
        headerStyle: { backgroundColor: 'white' }
        }} />
      <Stack.Screen name="endGame" options={{
          headerShown: false,
          }} />
      {/* <Stack.Screen name="Leaderboard" options={{
          headerShown: false,
          }} />
      <Stack.Screen name="Settings" options={{
          headerShown: false,
          }} /> */}
    </Stack>
    </GestureHandlerRootView>
    </ClerkLoaded>
  </ClerkProvider>
  );
}
