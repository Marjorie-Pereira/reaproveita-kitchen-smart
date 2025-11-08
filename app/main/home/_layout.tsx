import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Alert, Pressable } from "react-native";
export default function Layout() {
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout", error.message);
    }
  };

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "#5C9C59",
        headerStyle: {
          backgroundColor: "#5C9C59",
        },
        headerTintColor: "#fff",
        drawerStyle: {
          paddingTop: 50,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Reaproveita App",
          drawerLabel: "Início",
          headerTitleContainerStyle: {
            flex: 1,
            alignItems: "center",
          },
          headerLeftContainerStyle: {
            marginRight: 10,
          },
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/")}
              style={{ marginRight: 18 }}
            >
              <Feather name="user" size={24} color="#fff" onPress={onLogout} />
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Configurações",
          drawerLabel: "Configurações",
          //   headerLeft: () => (
          //     <Pressable >
          //       <Ionicons name="arrow-back" size={24} color={"#fff"} />
          //     </Pressable>
          //   ),
        }}
      />
      {/* <Drawer.Screen
        name="items/[group]"
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      /> */}

      <Drawer.Screen
        name="itemView"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          ),
          title: "Detalhes do item",
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
            alignItems: "center",
          },
          drawerItemStyle: {
            display: "none",
          },
        }}
      />

      <Drawer.Screen
        name="forms/newFoodItem"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          ),
          title: "Novo item",
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
            alignItems: "center",
          },
          drawerItemStyle: {
            display: "none",
          },
        }}
      />

      <Drawer.Screen
        name="forms/editFoodItem"
        options={{
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </Pressable>
            );
          },
          title: "Editar item",
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
            alignItems: "center",
          },
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
    </Drawer>
  );
}
