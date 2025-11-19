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
          fontWeight: "regular",
          color: "white",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Refeições" }} />
      <Stack.Screen name="recipes" options={{ title: "Receitas" }} />
      <Stack.Screen
        name="[recipe]"
        options={{ title: "Informações da Receita" }}
      />
    </Stack>
  );
};

export default Layout;
