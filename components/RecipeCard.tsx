import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Recipe {
  id: number;
  title: string;
  time: string;
  imageUri?: string;
  instructions: string;
  ingredients: string[];
}

export const RecipeCard: React.FC<Recipe> = ({
  title,
  time,
  imageUri,
  id,
  instructions,
  ingredients,
}) => {
  const recipeIngredients = ingredients.map((ing, index) => {
    const item = { id: index, ingredient: ing, checked: false };
    return item;
  });
  const recipe = { id, title, time, imageUri, instructions, recipeIngredients };
  return (
    <TouchableOpacity
      style={styles.recipeCardContainer}
      onPress={() =>
        router.navigate({
          pathname: `/main/recipes/[recipe]`,
          params: { recipe: JSON.stringify(recipe) },
        })
      }
    >
      <View>
        <Image
          resizeMode="cover"
          source={{
            uri:
              imageUri ??
              "https://swiftbr.vteximg.com.br/arquivos/ids/208740/618283-pizza-artesanal-calabresa_inn.jpg?v=638870725352100000",
          }}
          style={{
            width: "100%",
            aspectRatio: 1,
            marginBottom: 10,
          }}
        />
        <Text style={styles.recipeCardName}>{title}</Text>
        <View style={styles.timeInfoContainer}>
          <Feather
            name="clock"
            size={14}
            color="black"
            style={{
              margin: 0,
            }}
          />
          <Text style={styles.recipeCardTime}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCardContainer: {
    // Ajustado para o novo layout de View + wrap
    width: "48%", // Pouco menos de 1/3 para deixar margem
    marginBottom: 10,
    backgroundColor: "#e5e6e5ff",
    borderRadius: 8,
    alignItems: "flex-start",
    overflow: "hidden",
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
