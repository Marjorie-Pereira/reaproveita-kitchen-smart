import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RecipeFilterProps {
  text: string;
  isActive?: boolean;
  onPress?: () => void;
}
const RecipeFilter = (props: RecipeFilterProps) => {
  const { text, isActive, onPress } = props;

  const [isSelected, setIsSelected] = useState(isActive);

  useEffect(() => {
    setIsSelected(isActive ?? false);
  }, [isActive]);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsSelected((prev) => !prev);
        if (onPress) onPress();
      }}
      style={isActive ? styles.mealTagSelected : styles.mealTag}
    >
      {isActive && (
        <MaterialCommunityIcons name="check" size={18} color="#fff" />
      )}
      <Text
        style={isActive ? styles.mealTagTextSelected : styles.mealTagText}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mealTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5dee7", 
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  mealTagSelected: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#8a4d7d", 
  },
  mealTagText: {
    color: "#8a4d7d", 
    fontWeight: "600",
  },
  mealTagTextSelected: {
    color: "#fff", 
    marginLeft: 4,
    fontWeight: "600",
  },
});

export default RecipeFilter;
