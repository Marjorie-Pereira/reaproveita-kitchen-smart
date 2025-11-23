import DrawerContent from "@/components/DrawerContent";
import { COLORS } from "@/constants/theme";
import Drawer from "expo-router/drawer";
import React from "react";

const Layout = () => {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTitleStyle: {
          fontWeight: "regular",
          color: "white",
        },
        headerTintColor: "white",
        drawerActiveTintColor: COLORS.primary,
        drawerStyle: {
          paddingVertical: 20,
        },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Perfil e Preferências",
          title: "Perfil e Preferências",
        }}
      />
      <Drawer.Screen
        name="reports"
        options={{ drawerLabel: "Relatórios", title: "Relatórios" }}
      />

      <Drawer.Screen
        name="settings"
        options={{ drawerLabel: "Configurações", title: "Configurações" }}
      />
    </Drawer>
  );
};

export default Layout;
