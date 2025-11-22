import { COLORS } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        title: "Lista de Compras",
        headerStyle: {
          backgroundColor: "#5C9C59",
        },
        headerTitleStyle: {
          fontWeight: "regular",
          color: "white",
        },
        headerTintColor: "white",
        headerLeft: () => (
          <Feather
            name="shopping-cart"
            size={24}
            color={COLORS.white}
            style={{ marginRight: 10 }}
          />
        ),
      }}
    ></Stack>
  );
};

export default _layout;
