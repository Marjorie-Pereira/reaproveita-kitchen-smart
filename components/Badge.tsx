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
  mealType: string;
}

const mealTypeColors = {
  breakfast: {
    backgroundColor: "#FFEDD5",
    color: "#92400E",
    borderColor: "#FDE68A",
  }, 
  lunch: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    borderColor: "#BFDBFE",
  }, 
  dinner: {
    backgroundColor: "#F3E8FF",
    color: "#5B21B6",
    borderColor: "#E9D5FF",
  },
};

const Badge = ({ mealType = "breakfast" }: BadgeProps) => {
  const mappedMealType =
    mealType === "Café da Manhã"
      ? "breakfast"
      : mealType === "Almoço"
      ? "lunch"
      : "dinner";
  const { backgroundColor, color, borderColor } =
    mealTypeColors[mappedMealType];
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
    borderRadius: 9999, 
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12, 
    fontWeight: "500", 
  },
});

export default Badge;
