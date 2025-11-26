import { COLORS } from "@/constants/theme";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  containerStyles: ViewStyle;
  type?: "password" | "text";
  icon?: any;
  inputRef: React.Ref<TextInput> | undefined;
  togglePassword: () => void;
}
const Input = ({ ...props }) => {
  return (
    <View
      style={[styles.container, props.containerStyles && props.containerStyles]}
    >
      <TextInput
        style={{ flex: 1, color: COLORS.text }}
        placeholderTextColor={"#49454F"}
        ref={props.inputRef && props.inputRef}
        {...props}
      />

      {props.type === "password" ? (
        <Pressable onPress={props.togglePassword && props.togglePassword}>
          {props.icon && props.icon}
        </Pressable>
      ) : (
        props.icon && props.icon
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 0.4,
    borderColor: "#1E251E",
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
    backgroundColor: "#dbe0dbff",
  },
});
