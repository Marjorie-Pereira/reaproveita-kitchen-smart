import { supabase } from "@/lib/supabase";
import { mealType } from "@/types/mealTypeEnum";
import { recipeParamType } from "@/types/params";
import { recipe } from "@/types/recipeType";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface Meal {
  id: number;
  recipeId: number;
  style?: StyleProp<ViewStyle>;
  type: mealType;
}

export const MealCard: React.FC<Meal> = ({ id, recipeId, style, type }) => {
  const [recipe, setRecipe] = useState<recipe | null>(null);

  async function fetchRecipe() {
    const { data, error } = await supabase
      .from("ReceitasCompletas")
      .select("*")
      .eq("id", recipeId);
    if (error) throw Error(error.message);

    const responseRecipe: recipe = { ...data[0] };
    setRecipe(responseRecipe);
  }
  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  return (
    <TouchableOpacity
      style={[styles.recipeCardContainer, style && style]}
      onPress={() => {
        if (recipe) {
          const ingredients = recipe.ingredientes.split("| ");
          const recipeIngredients = ingredients.map((ing, index) => {
            const item = { id: index, ingredient: ing, checked: false };
            return item;
          });
          const recipeParam: recipeParamType = {
            id: recipe.id,
            title: recipe.receita,
            time: recipe.tempo_preparo,
            imageUri: recipe.link_imagem,
            instructions: recipe.modo_preparo,
            recipeIngredients,
          };
          console.log("recipe param", recipeParam);
          router.navigate({
            pathname: "/main/meals/[recipe]",
            params: { recipe: JSON.stringify(recipeParam) },
          });
        }
      }}
    >
      <View>
        <Image
          resizeMode="cover"
          source={{
            uri:
              recipe?.link_imagem ??
              "https://gnesjjmiiharouctxukk.supabase.co/storage/v1/object/public/app_bucket_public/placeholder.png",
          }}
          style={{
            width: "100%",
            aspectRatio: 1,
            marginBottom: 10,
          }}
        />
        <Text style={styles.recipeCardName}>{recipe?.receita}</Text>
        <View style={styles.timeInfoContainer}>
          <Feather
            name="clock"
            size={14}
            color="black"
            style={{
              margin: 0,
            }}
          />
          <Text style={styles.recipeCardTime}>{recipe?.tempo_preparo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCardContainer: {
    // Ajustado para o novo layout de View + wrap
    width: 160, // Pouco menos de 1/3 para deixar margem
    backgroundColor: "#e5e6e5ff",
    borderRadius: 8,
    alignItems: "flex-start",
    overflow: "hidden",
    marginRight: 15,
  },
  recipeCardImagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  recipeCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 8,
    marginTop: 4,
  },
  recipeCardTime: {
    fontSize: 12,
    color: "#777",
  },
  timeInfoContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 9,
  },
});
