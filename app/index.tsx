import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  useFonts,
} from "@expo-google-fonts/lato";
import { useRootNavigationState, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  SplashScreen.preventAutoHideAsync();
  const rootNavigationState = useRootNavigationState();
  if (!rootNavigationState.key) return null;
  const router = useRouter();

  const [loaded, fontError] = useFonts({
    Lato_400Regular,
    Lato_300Light,
    Lato_700Bold,
    "Lexend-Deca": require("../assets/fonts/LexendDeca-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [loaded, fontError]);

  if (!loaded && !fontError) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{ width: 220, height: 220, tintColor: "#345832ff" }}
      />
      <Text style={styles.title}>Reaproveita</Text>
      <Text style={styles.subtitle}>
        Bem-vindo à sua jornada contra o desperdício!{" "}
      </Text>
      <Pressable
        style={[styles.primaryBtn, styles.button]}
        onPress={() => router.push("/signUp")}
      >
        <Text style={styles.primaryBtnText}>Criar uma conta</Text>
      </Pressable>
      <View style={styles.loginContainer}>
        <Text style={{ textAlign: "center", fontFamily: "Lato_400Regular" }}>
          Já tem uma conta?{" "}
        </Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.underlineText}>Login</Text>
        </Pressable>
      </View>
      <View style={{ width: "100%", gap: 4 }}>
        <Text style={{ textAlign: "center", fontFamily: "Lato_400Regular" }}>
          ou
        </Text>

        <Pressable style={[styles.button, styles.secondaryBtn]}>
          <Text style={styles.secondaryBtnText}>Login com Google</Text>
        </Pressable>

        <Pressable onPress={() => router.push("./main")}>
          <Text style={styles.underlineText}>Usar sem uma conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFF5EE",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: "Lexend-Deca",
    color: "#581C3E",
    fontSize: 36,
  },
  subtitle: {
    fontFamily: "Lato_400Regular",
    color: "#1E251E",
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    borderRadius: 50,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: "#5C9C59",
  },
  primaryBtnText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    gap: 4,
  },
  underlineText: {
    color: "#AF387C",
    textDecorationLine: "underline",
    fontFamily: "Lato_400Regular",
    textAlign: "center",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#AF387C",
    marginVertical: 10,
  },
  secondaryBtnText: {
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    fontSize: 16,
  },
});
