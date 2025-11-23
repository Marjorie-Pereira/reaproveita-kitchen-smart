import { COLORS } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RestrictionChipProps {
  text: string;
  onRemove?: () => void;
}
const RestrictionChip = (props: RestrictionChipProps) => {
  const { text, onRemove } = props;
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Pressable onPress={onRemove}>
        <MaterialIcons name="cancel" size={18} color="black" />
      </Pressable>
    </View>
  );
};

export default RestrictionChip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondaryLight,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
  },
});
