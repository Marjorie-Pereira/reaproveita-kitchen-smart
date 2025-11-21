import FloatingButton from "@/components/FloatingButton";
import { MealCard } from "@/components/MealCard";
import { supabase } from "@/lib/supabase";
import { mealType } from "@/types/mealTypeEnum";
import { weekDaysMap } from "@/utils/weekDaysMap";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRootNavigationState,
} from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const daysOfWeek = [
  { label: "Seg", isSelected: true },
  { label: "Ter", isSelected: false },
  { label: "Qua", isSelected: false },
  { label: "Qui", isSelected: false },
  { label: "Sex", isSelected: false },
  { label: "Sáb", isSelected: false },
  { label: "Dom", isSelected: false },
];

const MealPlannerItem = ({
  mealId,
  recipeId,
  type,
}: {
  mealId: number;
  recipeId: number;
  type: mealType;
}) => <MealCard id={mealId} recipeId={recipeId} type={type} />;

const PlanWeeklyMeals = () => {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;
  const params = useLocalSearchParams();
  const [breakfast, setBreakFast] = useState<any[]>([]);
  const [lunch, setLunch] = useState<any[]>([]);
  const [dinner, setDinner] = useState<any[]>([]);
  const [weekDay, setWeekDay] = useState<keyof typeof weekDaysMap>("Seg");

  const actionButtons = [
    {
      icon: "",
      label: "Jantar",
      onPress: () =>
        router.navigate({
          pathname: "/main/meals/recipes",
          params: { category: "Janta", weekDay: weekDaysMap[weekDay] },
        }),
    },
    {
      icon: "",
      label: "Almoço",
      onPress: () =>
        router.navigate({
          pathname: "/main/meals/recipes",
          params: { category: "Almoço", weekDay: weekDaysMap[weekDay] },
        }),
    },
    {
      icon: "",
      label: "Café da Manhã",
      onPress: () =>
        router.navigate({
          pathname: "/main/meals/recipes",
          params: { category: "Café da Manhã", weekDay: weekDaysMap[weekDay] },
        }),
    },
  ];

  async function fetchMeals() {
    const { data, error } = await supabase
      .from("Refeicoes")
      .select("id, tipo, ReceitasCompletas(id)");
    if (error) throw Error(error.message);

    return data;
  }

  async function setMeals() {
    const meals = await fetchMeals();
    const breakfastMeals: any[] = [];
    const lunchMeals: any[] = [];
    const dinnerMeals: any[] = [];
    meals.forEach((meal) => {
      if (meal.tipo === "Café da Manhã") {
        breakfastMeals.push(meal);
      } else if (meal.tipo === "Almoço") {
        lunchMeals.push(meal);
      } else {
        dinnerMeals.push(meal);
      }
    });

    setBreakFast(breakfastMeals);
    setLunch(lunchMeals);
    setDinner(dinnerMeals);

    console.log(breakfast, lunch, dinner);
  }

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      console.log("params de meals", params);
      setMeals();

      return () => {
        router.setParams({});
      };
    }, [])
  );

  type mealRecipeType = {
    id: number;
    tipo: mealType;
    ReceitasCompletas: {
      id: number;
    };
  };

  return (
    <View style={styles.container}>
      <FloatingButton actions={actionButtons} />
      {/* Título Principal */}
      <Text style={styles.mainTitle}>Planejar Semana</Text>

      {/* Navegação dos Dias da Semana */}
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              day.label === weekDay && styles.selectedDayButton,
            ]}
            onPress={() => {
              setWeekDay(day.label as keyof typeof weekDaysMap);
            }}
          >
            <Text
              style={[
                styles.dayText,
                day.label === weekDay && styles.selectedDayText,
              ]}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mealTypeText}>Café da Manhã</Text>
        <ScrollView horizontal={true} style={[styles.mealTypeContainer]}>
          {breakfast?.map((item: mealRecipeType) => {
            const { ReceitasCompletas: recipe, id, tipo } = item;

            return (
              <MealPlannerItem
                recipeId={recipe.id}
                key={id}
                mealId={id}
                type={tipo}
              />
            );
          })}
        </ScrollView>

        <Text style={styles.mealTypeText}>Almoço</Text>
        <ScrollView horizontal={true} style={styles.mealTypeContainer}>
          {lunch?.map((item: mealRecipeType) => {
            const { ReceitasCompletas: recipe, id, tipo } = item;
            return (
              <MealPlannerItem
                recipeId={recipe.id}
                key={id}
                mealId={id}
                type={tipo}
              />
            );
          })}
        </ScrollView>

        <Text style={styles.mealTypeText}>Jantar</Text>
        <ScrollView horizontal={true} style={styles.mealTypeContainer}>
          {dinner?.map((item: mealRecipeType) => {
            const { ReceitasCompletas: recipe, id, tipo } = item;
            return (
              <MealPlannerItem
                recipeId={recipe.id}
                key={id}
                mealId={id}
                type={tipo}
              />
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Cor de fundo principal
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  // Estilos dos Dias da Semana
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 5,
    marginHorizontal: 2,
  },
  selectedDayButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#9B59B6", // Cor magenta da imagem
  },
  dayText: {
    fontSize: 16,
    color: "#666",
  },
  selectedDayText: {
    color: "#9B59B6",
    fontWeight: "bold",
  },

  // Estilos do Planejador de Refeição
  scrollContent: {
    paddingBottom: 20, // Espaçamento extra no final
  },
  mealTypeContainer: {
    marginBottom: 25,
    flexDirection: "row",
    height: 270,
    width: "100%",
  },
  mealTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9B59B6", // Cor magenta da imagem
    marginBottom: 10,
  },

  // Estilos do Card de Refeição
});

export default PlanWeeklyMeals;
