import FloatingButton from "@/components/FloatingButton";
import { RecipeCard } from "@/components/RecipeCard";
import { recipe } from "@/types/recipeType";
import { router } from "expo-router";
import React from "react";
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

const MealPlannerItem = ({ item }: { item: recipe }) => (
  <RecipeCard
    id={item.id}
    ingredients={item.ingredientes.split("| ")}
    title={item.receita}
    time={item.tempo_preparo}
    instructions={item.modo_preparo}
    imageUri={item.link_imagem}
    style={{ marginRight: 10, width: "30%" }}
  />
);

/**
 * Componente principal da tela de Planejar Semana (ignorando header e footer).
 */
const PlanWeeklyMeals = () => {
  const actionButtons = [
    {
      icon: "",
      label: "Jantar",
      onPress: () => router.navigate("/main/recipes"),
    },
    {
      icon: "",
      label: "Almoço",
      onPress: () => router.navigate("/main/recipes"),
    },
    {
      icon: "",
      label: "Café da Manhã",
      onPress: () => router.navigate("/main/recipes"),
    },
  ];
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
        <ScrollView horizontal={true} style={styles.mealTypeContainer}>
          {mealSchedule.map((item) => (
            <MealPlannerItem key={item.id} item={item} />
          ))}
        </ScrollView>

        <Text style={styles.mealTypeText}>Almoço</Text>
        <ScrollView horizontal={true} style={styles.mealTypeContainer}>
          {mealSchedule.map((item) => (
            <MealPlannerItem key={item.id} item={item} />
          ))}
        </ScrollView>

        <Text style={styles.mealTypeText}>Jantar</Text>
        <ScrollView horizontal={true} style={styles.mealTypeContainer}>
          {mealSchedule.map((item) => (
            <MealPlannerItem key={item.id} item={item} />
          ))}
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
    width: "100%",
  },
  mealTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9B59B6", // Cor magenta da imagem
    marginBottom: 10,
  },

  // Estilos do Card de Refeição
  mealCardContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden", // Para que a imagem respeite o borderRadius
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: "50%", // Define a largura para replicar o layout de meia tela
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  mealDetails: {
    justifyContent: "center",
    flex: 1,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  mealTime: {
    fontSize: 12,
    color: "#666",
  },
});

export default PlanWeeklyMeals;
