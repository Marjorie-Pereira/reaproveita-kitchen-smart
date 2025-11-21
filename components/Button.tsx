import { COLORS } from "@/constants/theme";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Loading from "./Loading";

interface buttonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  variant?: "primary" | "destructive" | "secondary";
  children: React.ReactNode;
}
const Button = ({
  buttonStyle = {},
  textStyle = {},
  onPress = () => {},
  loading = false,
  hasShadow = true,
  variant = "primary",
  children,
}: buttonProps) => {
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View
        style={[styles.button, buttonStyle, { backgroundColor: "#E3E2EB" }]}
      >
        <Loading />
      </View>
    );
  }

  const buttonBaseStyleMap = {
    destructive: styles.buttonDestructive,
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
  };

  const baseStyle = buttonBaseStyleMap[variant];

  return (
    <Pressable
      onPress={onPress}
      style={[baseStyle, styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      {children}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16, // size="lg" equivalent
    borderRadius: 12, // large rounded corners
    width: "100%",
    minHeight: 50,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary, // Indigo-600
  },
  buttonDestructive: {
    backgroundColor: COLORS.danger, // Red-600
  },
  buttonSecondary: {
    backgroundColor: COLORS.seconday,
  },
});
