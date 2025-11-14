import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

export default function _layout() {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <RootLayout />
      </SupabaseProvider>
    </AuthProvider>
  );
}

const RootLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        setAuth(session.user);
        router.replace("/main/home");
      } else {
        setAuth(null);
        router.replace("/");
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setAuth(session.user);
          router.replace("/main/home");
        } else {
          setAuth(null);
          router.replace("/");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

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
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="signUp"
        options={{
          title: "Cadastro",
        }}
      />

      <Stack.Screen
        name="main"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="cameraTest"
        options={{
          title: "Tirar foto",
        }}
      />
    </Stack>
  );
};
