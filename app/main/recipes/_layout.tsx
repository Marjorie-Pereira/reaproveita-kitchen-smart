import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Planejar Refeições" }} />
    </Stack>
  );
};

export default Layout;
