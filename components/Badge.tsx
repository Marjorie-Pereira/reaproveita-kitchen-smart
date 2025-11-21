import { StyleSheet, Text, View } from "react-native";

interface Meal {
  id: string;
  recipeName: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  plannedDay: string;
  consumed: boolean;
  hasLeftovers: boolean;
  timeConsumed: string;
}
interface BadgeProps {
  mealType: Meal["mealType"];
}

const mealTypeColors = {
  breakfast: {
    backgroundColor: "#FFEDD5",
    color: "#92400E",
    borderColor: "#FDE68A",
  }, // Amber equivalent
  lunch: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    borderColor: "#BFDBFE",
  }, // Blue equivalent
  dinner: {
    backgroundColor: "#F3E8FF",
    color: "#5B21B6",
    borderColor: "#E9D5FF",
  }, // Purple equivalent
  snack: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    borderColor: "#A7F3D0",
  }, // Green equivalent
};

const mealTypeMap = {
  "Café da Manhã": "breakfast",
  Almoço: "lunch",
  Janta: "dinner",
};

const Badge = ({ mealType }: BadgeProps) => {
  const mappedMealType = mealTypeMap[mealType as keyof typeof mealTypeMap];
  const { backgroundColor, color, borderColor } =
    mealTypeColors[mappedMealType as Meal["mealType"]];
  return (
    <View style={[styles.badgeBase, { backgroundColor, borderColor }]}>
      <Text style={[styles.badgeText, { color }]}>
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeBase: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999, // full rounded
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12, // text-xs
    fontWeight: "500", // medium
  },
});

export default Badge;
