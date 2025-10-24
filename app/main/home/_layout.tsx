import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
export default function Layout() {
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
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: "Reaproveita App",
          headerTitleContainerStyle: {
            flex: 1,
            alignItems: "center",
            
          },
          headerLeftContainerStyle: {
            marginRight: 10,
          },
          headerRight: () => (
            <Pressable onPress={() => router.push("/")} style={{marginRight: 18}}>
              <Feather name="user" size={24} color="#fff" />
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
    </Drawer>
  );
}
