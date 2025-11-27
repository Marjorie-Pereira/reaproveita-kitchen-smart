import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { Alert } from "react-native";
export default function Layout() {
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout", error.message);
    }
  };

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
      <Stack.Screen
        name="index"
        options={{
          title: "Reaproveita App",
        }}
      />
      <Stack.Screen
        name="items/itemView"
        options={{
          title: "Informações do item",
        }}
      />
      <Stack.Screen
        name="items/index"
        options={{
          title: "Algo",
        }}
      />
      <Stack.Screen
        name="forms/newFoodItem"
        options={{
          title: "Cadastrar novo item",
        }}
      />
      <Stack.Screen
        name="leftovers/index"
        options={{
          title: "Sobras de refeições",
        }}
      />
      <Stack.Screen
        name="leftovers/leftover"
        options={{
          title: "Detalhes da sobra",
        }}
      />
      <Stack.Screen
        name="leftovers/recipesLeftovers"
        options={{
          title: "Receitas para Reaproveitar",
        }}
      />
    </Stack>
  );
}
