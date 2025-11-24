import { usePush } from "@/hooks/usePush";
import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  usePush();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4A7D47",
        tabBarStyle: {
          backgroundColor: "#EFF5EE",
        },
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
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          tabBarLabel: "Refeições",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shoppingList"
        options={{
          tabBarLabel: "Compras",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
