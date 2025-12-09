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
        name="forms/editFoodItem"
        options={{
          title: "Editar Informações",
        }}
      />
      
       <Stack.Screen
        name="leftovers"
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="recipes"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
