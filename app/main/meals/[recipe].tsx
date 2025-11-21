import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type recipeType = {
  id: number;
  imageUri: string;
  title: string;
  time: string;
  instructions: string;
  recipeIngredients: any[];
};

const IngredientItem = ({ name, checked, onPress }: any) => (
  <TouchableOpacity style={styles.ingredientRow} onPress={onPress}>
    <Text style={styles.ingredientText}>{name}</Text>
    <View>
      <MaterialIcons
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={24}
        color="#7C4C8D" // Cor de exemplo
      />
    </View>
  </TouchableOpacity>
);

const RecipeView = () => {
  const {
    mealType,
    isSaved,
    recipe: recipeParam,
    weekDay,
  } = useLocalSearchParams();
  const { user } = useAuth();

  console.log("dia da semana", weekDay);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      console.log("recipe json", JSON.parse(recipeParam as string));

      return () => {
        router.setParams({});
      };
    }, [])
  );

  const recipe: recipeType = JSON.parse(recipeParam as string);
  const isSavedBool = isSaved === "true";

  const [ingredients, setIngredients] = useState(recipe?.recipeIngredients);

  const toggleCheck = (id: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients?.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  async function handleSaveRecipe() {
    if (!recipe) return;
    const ingredientsString = recipe?.recipeIngredients
      .map((item) => item.ingredient)
      .join(", ");
    const { error } = await supabase.from("ReceitasSalvas").insert({
      id_receita: recipe.id,
      id_usuario: user.id,
      receita: recipe.title,
      ingredientes: ingredientsString,
      modo_preparo: recipe.instructions,
      link_imagem: recipe.imageUri,
      tempo_preparo: recipe.time,
    });

    if (error) throw Error(error.message);
    else {
      Alert.alert("Receita Salva!");
      router.back();
    }
  }

  //   remove from saved

  async function handleAddMeal() {
    console.log(recipe);
    const { error } = await supabase.from("Refeicoes").insert({
      id_receita: recipe.id,
      tipo: mealType,
      dia_da_semana: weekDay,
    });
    if (error) throw Error(error.message);
    else {
      Alert.alert("Refeição Cadastrada!");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bloco superior (Imagem, Título, Tempo, Botão) */}
        <View style={styles.recipeHeader}>
          <View style={styles.imagePlaceholder}>
            <Image
              resizeMode="cover"
              source={{
                uri:
                  recipe.imageUri ??
                  "https://swiftbr.vteximg.com.br/arquivos/ids/208740/618283-pizza-artesanal-calabresa_inn.jpg?v=638870725352100000",
              }}
              style={styles.imagePlaceholder}
            />
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.titleText}>{recipe.title}</Text>
            <Text style={styles.infoText}>Tempo de preparo: {recipe.time}</Text>
            <Button
              buttonStyle={[styles.saveButton, isSaved && { padding: 10 }]}
              onPress={handleSaveRecipe}
            >
              <Text style={styles.buttonText}>
                {isSaved === "true" ? "Remover de salvas" : "Salvar"}
              </Text>
            </Button>
            <Button
              buttonStyle={{
                ...styles.saveButton,
                width: "65%",
                padding: 5,
              }}
              onPress={handleAddMeal}
              variant="secondary"
            >
              <Text style={styles.buttonText}>Adicionar ao dia</Text>
            </Button>
          </View>
        </View>

        {/* Modo de Preparo */}
        <Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
          Modo de preparo
        </Text>
        <Text style={[styles.instructionText, styles.paddingHorizontal]}>
          {recipe.instructions}
        </Text>

        {/* Ingredientes */}
        <Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
          Ingredientes
        </Text>
        <View style={styles.ingredientsList}>
          {ingredients?.map((item) => (
            <IngredientItem
              key={item.id}
              name={item.ingredient}
              checked={item.checked}
              onPress={() => toggleCheck(item.id)} // Adicionando interatividade
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeView;

// --- Definição dos Estilos com StyleSheet.create ---
const PRIMARY_COLOR = "#7C4C8D";
const BACKGROUND_COLOR = "#FFFFFF";
const TEXT_COLOR = "#333333";
const LIGHT_GRAY = "#F0F0F0";
const GREEN_BUTTON = "#5CB85C";
const PADDING_HORIZONTAL = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  paddingHorizontal: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },

  // Estilos do cabeçalho de receita
  recipeHeader: {
    flexDirection: "row",
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 20,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    marginRight: 15,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: "space-around",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  infoText: {
    fontSize: 14,
    color: TEXT_COLOR,
    marginBottom: 5,
  },
  saveButton: {
    borderRadius: 20,
    alignSelf: "flex-start",
    alignItems: "center",
    marginBottom: 5,
    width: "50%",
  },
  buttonText: {
    color: BACKGROUND_COLOR,
    fontWeight: "bold",
    fontSize: 14,
  },

  // Estilos das seções de texto (Modo de preparo, Ingredientes)
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: TEXT_COLOR,
    marginTop: 20,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },

  // Estilos da lista de ingredientes
  ingredientsList: {
    marginTop: 10,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  ingredientText: {
    fontSize: 16,
    color: TEXT_COLOR,
    flex: 1,
  },
});
