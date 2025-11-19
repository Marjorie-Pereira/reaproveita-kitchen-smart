import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Loading from "./Loading";

interface buttonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title: string;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  outline?: boolean;
}
const Button = ({
  buttonStyle = {},
  textStyle = {},
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
  outline = false,
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

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4A7D47",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  text: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});
