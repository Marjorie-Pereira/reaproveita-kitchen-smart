import { supabase } from "@/lib/supabase";
import { recipe } from "@/types/recipeType";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Replaced lucide-react with react-native-vector-icons/Feather (a standard RN icon library)

// --- Type Definitions (Mantidas) ---

interface Meal {
  id: string;
  recipeName: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  plannedDay: string;
  consumed: boolean;
  hasLeftovers: boolean;
  timeConsumed: string;
}

interface MealViewScreenProps {
  meal: Meal;
  onConsumedChange: (checked: boolean) => void;
  onLeftoversChange: (checked: boolean) => void;
  onTimeChange: (time: string) => void;
  onViewRecipe: () => void;
  onRemoveMeal: () => void;
}

// --- Style Data (Adaptado para RN) ---

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

// --- Helper Functions (Mantidas) ---

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time part for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return "Today";
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    // RN's toLocaleDateString might behave differently, using manual formatting for consistency
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
};

// --- Simplified React Native Components (Mocking Shadcn/Radix UI) ---

// Componente para ícones (usando Feather)
interface IconProps {
  name: string;
  size: number;
  color: string;
}
const Icon = ({ name, size, color }: IconProps) => (
  <Feather
    name={name as keyof typeof Feather.getImageSource}
    size={size}
    color={color}
  />
);

// Componente RNButton (TouchableOpacity para cliques)
interface RNButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  variant?: "primary" | "destructive";
}
const RNButton = ({
  children,
  onPress,
  style,
  variant = "primary",
}: RNButtonProps) => {
  const baseStyle =
    variant === "destructive" ? styles.buttonDestructive : styles.buttonPrimary;
  return (
    <TouchableOpacity
      style={[baseStyle, styles.buttonBase, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
};

// Componente RNInput (TextInput)
interface RNInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  style?: any;
}
const RNInput = ({ value, onChangeText, style, ...props }: RNInputProps) => (
  <TextInput
    style={[style]}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#9CA3AF" // gray-400
    {...props}
  />
);

// Componente RNCheckbox (usando Switch para simular o comportamento de toggle)
interface RNCheckboxProps {
  id: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}
const RNCheckbox = ({
  checked = false,
  onCheckedChange,
  label,
}: RNCheckboxProps) => (
  <View style={styles.checkboxContainer}>
    <Switch
      value={checked}
      onValueChange={onCheckedChange}
      trackColor={{ false: "#E5E7EB", true: "#4F46E5" }} // gray-200 and indigo-600
      thumbColor={checked ? "#FFFFFF" : "#F3F4F6"} // white and gray-100
      style={styles.switchStyle}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </View>
);

// Componente RNBadge (View/Text estilizado)
interface RNBadgeProps {
  mealType: Meal["mealType"];
}
const RNBadge = ({ mealType = "breakfast" }: RNBadgeProps) => {
  const { backgroundColor, color, borderColor } = mealTypeColors.breakfast;
  return (
    <View style={[styles.badgeBase, { backgroundColor, borderColor }]}>
      <Text style={[styles.badgeText, { color }]}>
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Text>
    </View>
  );
};

// --- Main Component ---

export default function MealViewScreen({
  onConsumedChange,
  onLeftoversChange,
  onTimeChange,
  onViewRecipe,
  onRemoveMeal,
}: MealViewScreenProps) {
  const { meal: mealId, recipe: recipeId } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>();
  const [recipe, setRecipe] = useState<recipe>();

  async function fetchMeal() {
    const { data, error } = await supabase
      .from("Refeicoes")
      .select("*")
      .eq("id", mealId);
    if (error) throw new Error(error.message);
    setMeal(data[0]);
  }

  async function fetchRecipe() {
    const { data, error } = await supabase
      .from("ReceitasCompletas")
      .select("*")
      .eq("id", recipeId);
    if (error) throw new Error(error.message);
    setRecipe(data[0]);
  }

  useEffect(() => {
    fetchMeal();
    fetchRecipe();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Main Card */}
        <View style={styles.card}>
          <Image
            resizeMode="cover"
            source={{
              uri:
                recipe?.link_imagem ??
                "https://gnesjjmiiharouctxukk.supabase.co/storage/v1/object/public/app_bucket_public/placeholder.png",
            }}
            style={{
              width: "80%",
              aspectRatio: 1,
              marginBottom: 10,
              alignSelf: "center",
            }}
          />
          {/* Recipe Name */}
          <View style={styles.cardSection}>
            <Text style={styles.h2}>{recipe?.receita}</Text>

            <View style={styles.detailsRow}>
              <RNBadge mealType={meal?.tipo} />

              <View style={styles.calendarContainer}>
                <Icon name="calendar" size={16} color="#4B5563" />
                <Text style={styles.calendarText}>{meal?.dia_programado}</Text>
              </View>
            </View>
          </View>

          {/* Options */}
          <View style={styles.cardSectionOptions}>
            {/* Consumed Checkbox */}
            <RNCheckbox
              id="consumed"
              // checked={meal?.consumed}
              onCheckedChange={onConsumedChange}
              label="Marcar como consumido"
            />

            {
              //   meal?.consumed && (
              //     <View style={styles.timeInputContainer}>
              //       <View style={styles.timeLabelContainer}>
              //         <Icon name="clock" size={14} color="#4B5563" />
              //         <Text style={styles.timeLabelText}>Hora do consumo</Text>
              //       </View>
              //       {/* Note: RN TextInput does not have a 'type="time"'.
              //           You would typically use a DatePicker component for time input in a real app.
              //           Here, we use a simple TextInput for the refactoring purpose. */}
              //       <RNInput
              //         value={meal?.timeConsumed}
              //         onChangeText={onTimeChange}
              //         placeholder="Ex: 12:30"
              //         style={styles.timeInput}
              //       />
              //     </View>
              //   )
            }
            {/* Leftovers Checkbox */}
            <RNCheckbox
              id="leftovers"
              checked={meal?.tem_sobras}
              onCheckedChange={onLeftoversChange}
              label="Tem sobras"
            />
          </View>

          {/* Actions */}
          <View style={styles.cardSectionActions}>
            <RNButton
              onPress={onViewRecipe}
              style={styles.actionButton}
              variant="primary"
            >
              <Icon name="book-open" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Ver Receita</Text>
            </RNButton>

            <RNButton
              onPress={onRemoveMeal}
              style={styles.actionButton}
              variant="destructive"
            >
              <Icon name="trash-2" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Remover Refeição</Text>
            </RNButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// --- Stylesheet (Equivalent to Tailwind Classes) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxWidth: 400, // max-w-md
    alignSelf: "center", // mx-auto
    width: "100%",
  },
  header: {
    marginBottom: 24, // mb-6
    marginTop: 8, // mt-2
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // gap-2
    marginBottom: 16, // mb-4
  },
  h1: {
    fontSize: 20,
    fontWeight: "700", // Semibold/Bold
    color: "#374151", // gray-700
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // shadow-sm
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    overflow: "hidden",
  },
  cardSection: {
    padding: 24, // p-6
    borderBottomWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  cardSectionOptions: {
    padding: 24, // p-6
    paddingVertical: 16,
    gap: 16, // space-y-4
  },
  cardSectionActions: {
    padding: 24, // p-6
    paddingTop: 8, // pt-2
    gap: 12, // space-y-3
  },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12, // mb-3
    color: "#1F2937", // gray-800
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // gap-3
    flexWrap: "wrap",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // gap-1.5
    color: "#4B5563", // text-gray-600
  },
  calendarText: {
    fontSize: 14, // text-sm
    color: "#4B5563",
  },

  // Badge Styles
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

  // Checkbox/Switch Styles
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

  // Time Input Styles
  timeInputContainer: {
    marginLeft: 32, // ml-7 equivalent (approx 28px)
    gap: 8, // space-y-2
  },
  timeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // gap-1.5
  },
  timeLabelText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
  },
  timeInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 150, // max-w-[150px]
    backgroundColor: "#FFFFFF",
  },

  // Button Styles
  buttonBase: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16, // size="lg" equivalent
    borderRadius: 12, // large rounded corners
    width: "100%",
    minHeight: 50,
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5", // Indigo-600
  },
  buttonDestructive: {
    backgroundColor: "#DC2626", // Red-600
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8, // Space between icon and text
  },
  actionButton: {
    // Full width already handled by buttonBase
  },
});
