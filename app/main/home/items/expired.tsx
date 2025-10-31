import FloatingButton from "@/components/FloatingButton";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const ExpiredItems = () => {
  const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
    {
      label: "Cadastrar",
      icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
      onPress: () => router.push("/main/home/forms/newFoodItem"),
    },
    {
      label: "Escanear",
      icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
      onPress: () => null,
    },
  ];
  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar placeholder="Pesquisar itens vencidos..." />
        <LocationButtonGroup onSelect={() => null} />
        <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
        <ScrollView>
          <View style={styles.foodItemsGrid}></View>
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

export default ExpiredItems;
