import { usePush } from "@/hooks/usePush";
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
          title: "Refeições",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shoppingList"
        options={{
          title: "Compras",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="recipes"
        options={{
          // tabBarItemStyle: {
          //   display: "none",
          // },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
