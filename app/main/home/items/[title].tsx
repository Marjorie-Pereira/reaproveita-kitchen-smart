import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ItemsPage = () => {
  const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
    {
      label: "Cadastrar",
      icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
      onPress: () => null,
    },
    {
      label: "Escanear",
      icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
      onPress: () => null,
    },
  ];
  const { title } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          title: title != "Sobras" ? `Itens ${title}` : `${title}`,
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar
          placeholder={`Pesquisar itens ${String(title).toLowerCase()}...`}
        />
        <LocationButtonGroup />
        <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
        <ScrollView>
          <View style={styles.foodItemsGrid}>
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
            <FoodCard
              image={require("@/assets/images/milk.png")}
              title="Leite"
              brand="Piracanjuba"
              quantity={1}
              measureUnit="Litro"
              expirationDate={new Date()}
              category="Laticínios"
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  foodItemsGrid: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
  },
});

export default ItemsPage;
