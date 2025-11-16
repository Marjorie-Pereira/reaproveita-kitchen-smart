import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export interface Recipe {
  id: string;
  name: string;
  time: string;
  imageUri?: string;
}

export const RecipeCard: React.FC<Recipe> = ({ name, time, imageUri }) => (
  <View style={styles.recipeCardContainer}>
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
    <Text style={styles.recipeCardName}>{name}</Text>
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
);

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
