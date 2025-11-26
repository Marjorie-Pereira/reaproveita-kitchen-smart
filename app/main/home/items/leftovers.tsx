import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { foodItem } from "@/types/FoodListItemProps";
import { getLocationId } from "@/utils/locationUtils";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
const groupMap = {
  leftovers: "Sobras",
  expiring: "Itens Vencendo",
  expired: "Itens Vencidos",
  open: "Itens Abertos",
  all: "Todos os itens",
};

import { mealType } from "@/types/mealTypeEnum";

const Leftovers = () => {
  const [location, setLocation] = useState<string>("Geladeira");
  const [leftovers, setLeftovers] = useState<mealType[]>([]);

  const getLeftovers = (items: foodItem[]) => {
    return [];
  };

  async function fetchItemsFromLocation(
    field: string = "",
    value: string = ""
  ) {
    console.log("Buscando itens de", location ?? "Geladeira");

    const { id } = await getLocationId(location ?? "Geladeira");
    const { data, error } = await supabase
      .from("Alimentos")
      .select("*")
      .eq("id_ambiente", id)
      .eq(field, value);

    if (error) {
      throw Error(error.message);
    }

    return data;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sobras",
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar placeholder="Pesquisar itens..." />
        <LocationButtonGroup
          onSelect={(val) => setLocation(val)}
          activeBtn={location}
        />

        <ScrollView>
          <View style={styles.foodItemsGrid}>
            {/* {foodList.map((item: foodItem) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{ width: "48%" }}
                  onPress={() =>
                    router.navigate({
                      pathname: "/main/home/items/itemView",
                      params: { itemId: item.id },
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
            })} */}
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
    gap: 10,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

export default Leftovers;
