import { Stack } from "expo-router";
import { useEffect } from "react";
import { useUserSession } from "../lib/store";
import { createUserID } from "./lib/userSession";

export default function RootLayout() {
  const setUserId = useUserSession((state) => state.setUserId);

  // Generate and store userId on app launch
  useEffect(() => {
    const userId = createUserID();
    setUserId(userId);
    console.log("User session initialized with ID:", userId);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modules/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
