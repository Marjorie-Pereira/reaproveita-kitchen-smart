import FloatingButton from "@/components/FloatingButton";
import { MealCard } from "@/components/MealCard";
import { supabase } from "@/lib/supabase";
import { mealType } from "@/types/mealTypeEnum";
import { recipe } from "@/types/recipeType";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mealSchedule: recipe[] = [
  {
    id: 1,
    categoria: "Café da manhã",
    ingredientes: "banana| farinha",
    IngredientesBase: [],
    link_imagem:
      "https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg?crop=0.6667877686951256xw:1xh;center,top&resize=1200:*",
    modo_preparo: "se vira aí",
    receita: "Panquecas Americanas",
    tempo_preparo: "15 min",
  },
  {
    id: 2,
    categoria: "Almoço",
    ingredientes: "banana| farinha",
    IngredientesBase: [],
    link_imagem:
      "https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg?crop=0.6667877686951256xw:1xh;center,top&resize=1200:*",
    modo_preparo: "se vira aí",
    receita: "Panquecas Americanas",
    tempo_preparo: "15 min",
  },
  {
    id: 3,
    categoria: "Almoço",
    ingredientes: "banana| farinha",
    IngredientesBase: [],
    link_imagem:
      "https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg?crop=0.6667877686951256xw:1xh;center,top&resize=1200:*",
    modo_preparo: "se vira aí",
    receita: "Panquecas Americanas",
    tempo_preparo: "15 min",
  },
  // Adicione mais refeições conforme necessário
];

const daysOfWeek = [
  { label: "Seg", isSelected: true },
  { label: "Ter", isSelected: false },
  { label: "Qua", isSelected: false },
  { label: "Qui", isSelected: false },
  { label: "Sex", isSelected: false },
  { label: "Sáb", isSelected: false },
  { label: "Dom", isSelected: false },
];

const actionButtons = [
  {
    icon: "",
    label: "Jantar",
    onPress: () =>
      router.navigate({
        pathname: "/main/meals/recipes",
        params: { category: "Janta" },
      }),
  },
  {
    icon: "",
    label: "Almoço",
    onPress: () =>
      router.navigate({
        pathname: "/main/meals/recipes",
        params: { category: "Almoço" },
      }),
  },
  {
    icon: "",
    label: "Café da Manhã",
    onPress: () =>
      router.navigate({
        pathname: "/main/meals/recipes",
        params: { category: "Café da Manhã" },
      }),
  },
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
  const params = useLocalSearchParams();
  const [breakfast, setBreakFast] = useState<any[]>([]);
  const [lunch, setLunch] = useState<any[]>([]);
  const [dinner, setDinner] = useState<any[]>([]);

  async function fetchMeals() {
    const { data, error } = await supabase
      .from("Refeicoes")
      .select("id, tipo, ReceitasCompletas(id)");
    if (error) throw Error(error.message);

    return data;
  }

  async function setMeals() {
    const meals = await fetchMeals();
    const breakfastMeals = meals.filter((d) => d.tipo === "Café da Manhã");
    const lunchMeals = meals.filter((d) => d.tipo === "Almoço");
    const dinnerMeals = meals.filter((d) => d.tipo === "Janta");

    setBreakFast(breakfastMeals);
    setDinner(dinnerMeals);
    setLunch(lunchMeals);
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
              day.isSelected && styles.selectedDayButton,
            ]}
          >
            <Text
              style={[styles.dayText, day.isSelected && styles.selectedDayText]}
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
