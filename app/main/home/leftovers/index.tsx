import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { getLocationId } from "@/utils/locationUtils";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
const groupMap = {
  leftovers: "Sobras",
  expiring: "Itens Vencendo",
  expired: "Itens Vencidos",
  open: "Itens Abertos",
  all: "Todos os itens",
};

import { MealCard } from "@/components/MealCard";
import { mealObject } from "@/types/mealObject.type";
import { formatDate } from "date-fns";

const Leftovers = () => {
  const [location, setLocation] = useState<"Geladeira" | "Freezer">(
    "Geladeira"
  );
  const [leftovers, setLeftovers] = useState<mealObject[]>([]);
  const router = useRouter();

  async function fetchLeftoversFromLocation(location: "Geladeira" | "Freezer") {
    console.log("Buscando itens de", location);
    const { id } = await getLocationId(location);

    const { data, error } = await supabase
      .from("Refeicoes")
      .select("*")
      .eq("id_ambiente", id)
      .eq("tem_sobras", true);

    if (error) {
      throw Error(error.message);
    }

    setLeftovers(data);
  }

  useFocusEffect(
    useCallback(() => {
      fetchLeftoversFromLocation(location);
    }, [location])
  );

  useEffect(() => {
    console.log(leftovers.length);
  }, [leftovers]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sobras",
        }}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingTop: 20,
          gap: 20,
          justifyContent: "center",
        }}
      >
        <SearchBar placeholder="Pesquisar itens..." />
        <LocationButtonGroup
          onSelect={(val) => setLocation(val as typeof location)}
          activeBtn={location}
          screen="leftovers"
        />

        <ScrollView>
          <View style={styles.foodItemsGrid}>
            {leftovers.map((item: mealObject) => {
              return (
                <TouchableOpacity key={item.id} onPress={() => {}}>
                  <MealCard
                    id={item.id!}
                    recipeId={item.id_receita}
                    type={"Almoço"}
                    style={{ marginRight: 0 }}
                    onPress={() => {
                      router.push({
                        pathname: "/main/home/leftovers/leftover",
                        params: { mealId: item.id },
                      });
                    }}
                    leftoverDate={formatDate(item.data_sobras, "dd/MM/yyyy")}
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
    gap: 20,
    paddingHorizontal: 20,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

export default Leftovers;
