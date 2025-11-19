import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RecipeFilterProps {
  text: string;
  isActive?: boolean;
}
const RecipeFilter = (props: RecipeFilterProps) => {
  const { text, isActive } = props;

  const [isSelected, setIsSelected] = useState(isActive);

  useEffect(() => {
    console.log(`is ${text}`, isActive);
    setIsSelected(isActive ?? false);
  }, []);

  return (
    <TouchableOpacity
      onPress={() => setIsSelected((prev) => !prev)}
      style={isSelected ? styles.mealTagSelected : styles.mealTag}
    >
      {isSelected && (
        <MaterialCommunityIcons name="check" size={18} color="#fff" />
      )}
      <Text
        style={isSelected ? styles.mealTagTextSelected : styles.mealTagText}
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
    backgroundColor: "#f5dee7", // Cor de fundo das tags (Rosa Claro)
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
    backgroundColor: "#8a4d7d", // Cor de fundo da tag selecionada (Roxo)
  },
  mealTagText: {
    color: "#8a4d7d", // Cor do texto das tags
    fontWeight: "600",
  },
  mealTagTextSelected: {
    color: "#fff", // Cor do texto da tag selecionada
    marginLeft: 4,
    fontWeight: "600",
  },
});

export default RecipeFilter;
