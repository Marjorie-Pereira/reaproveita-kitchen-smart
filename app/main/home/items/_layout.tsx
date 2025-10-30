import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#5C9C59",
        },
        headerTitleStyle: {
          color: "white",
        },
        headerTintColor: "white",
      }}
    />
  );
};

export default Layout;
