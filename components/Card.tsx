import { labelColor, labelTextColor } from "@/constants/status.colors";
import { labelColorMap } from "@/types/statusColorMap";
import { Lato_400Regular, useFonts } from "@expo-google-fonts/lato";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({
  icon,
  label,
  itemsCount,
  onPress,
}: {
  icon: any;
  label: string;
  itemsCount: number;
  onPress: () => void;
}) {
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
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: labelColor[label as keyof labelColorMap] },
      ]}
      onPress={onPress}
    >
      <View style={styles.statCardInfo}>
        {icon}
        <Text
          style={[
            styles.statCardTitle,
            { color: labelTextColor[label as keyof labelColorMap] },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          styles.statCardCount,
          { color: labelTextColor[label as keyof labelColorMap] },
        ]}
      >
        {itemsCount}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 15,
    elevation: 5,
  },
  statCardInfo: {
    alignItems: "flex-start",
    gap: 5,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statCardCount: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "right",
  },
});
