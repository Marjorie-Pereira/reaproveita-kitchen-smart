import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#5C9C59", // Sets the background color of the header
        },
        headerTitleStyle: {
          fontWeight: "regular", // Styles the header title text
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="main"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
