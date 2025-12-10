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
      trackColor={{ false: "#E5E7EB", true: COLORS.seconday }} 
      thumbColor={checked ? "#FFFFFF" : "#F3F4F6"}
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
    
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1F2937", 
    flex: 1,
  },
});

export default SwitchBtn;
