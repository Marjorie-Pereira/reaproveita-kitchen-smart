import { Lato_400Regular, useFonts } from "@expo-google-fonts/lato";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Card({ icon, label }: { icon: any; label: string }) {

    SplashScreen.preventAutoHideAsync();
      const router = useRouter();
    
      const [loaded, error] = useFonts({
        Lato_400Regular,
      });
    
      useEffect(() => {
        if (loaded || error) {
          SplashScreen.hideAsync();
        }
      }, [loaded, error]);
    
      if (!loaded && !error) {
        return null;
      }

  return (
    <TouchableOpacity style={styles.card}>
      {icon}
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EFF5EE",
    width: "47%",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 12,
    elevation: 2,
  },
  cardLabel: {
    marginTop: 8,
    fontWeight: "400",
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
    color: "#333",
  },
});
