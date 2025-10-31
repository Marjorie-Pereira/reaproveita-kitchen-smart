import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { foodItem } from "@/types/FoodListItemProps";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const AllItems = () => {
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

  const [location, setLocation] = useState("Geladeira");
  const [foodItems, setFoodItems] = useState<any[]>([]);

  async function getLocationId(location: string) {
    const { data, error } = await supabase
      .from("Ambientes")
      .select("id")
      .eq("nome", location);

    if (error) {
      throw Error(error.message);
    }

    return data[0];
  }

  async function fetchItemsFromLocation() {
    const { id } = await getLocationId(location);
    const { data, error } = await supabase
      .from("Alimentos")
      .select("*")
      .eq("id_ambiente", id);

    if (error) {
      throw Error(error.message);
    }

    setFoodItems(data);
  }

  useFocusEffect(
    useCallback(() => {
      fetchItemsFromLocation();
    }, [location])
  );

  return (
    <>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar placeholder="Pesquisar itens..." />
        <LocationButtonGroup onSelect={(val) => setLocation(val)} />
        <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
        <ScrollView>
          <View style={styles.foodItemsGrid}>
            {foodItems.map((item: foodItem) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{ width: "48%" }}
                  onPress={() =>
                    router.push({
                      pathname: "/main/home/items/itemView",
                      params: { ...item },
                    })
                  }
                >
                  <FoodCard
                    image={item.imagem}
                    title={item.nome}
                    brand={item.marca}
                    quantity={item.quantidade}
                    measureUnit={item.unidade_medida}
                    expirationDate={new Date(item.data_validade)}
                    category={item.categoria}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  foodItemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
});

export default AllItems;
