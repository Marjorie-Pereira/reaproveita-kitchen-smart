import { COLORS } from "@/constants/theme";
import { StyleSheet, Switch, Text, View } from "react-native";

interface SwitchBtnProps {
  id: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled: boolean;
}

const SwitchBtn = ({
  checked = false,
  onCheckedChange,
  label,
  disabled,
}: SwitchBtnProps) => (
  <View style={styles.checkboxContainer}>
    <Switch
      value={checked}
      onValueChange={onCheckedChange}
      trackColor={{ false: "#E5E7EB", true: COLORS.seconday }} // gray-200 and indigo-600
      thumbColor={checked ? "#FFFFFF" : "#F3F4F6"} // white and gray-100
      style={styles.switchStyle}
      disabled={disabled}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchStyle: {
    // You may need to adjust the position for better alignment based on the specific RN environment
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1F2937", // text-gray-800
    flex: 1,
  },
});

export default SwitchBtn;
