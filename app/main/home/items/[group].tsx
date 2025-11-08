import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { foodItem } from "@/types/FoodListItemProps";
import { getLocationId } from "@/utils/locationUtils";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Drawer from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Inventory = () => {
  const { group } = useLocalSearchParams();
  const params = useLocalSearchParams();
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
  const [foodList, setFoodList] = useState<foodItem[]>([]);
  const [headerTitle, setHeaderTitle] = useState("Todos os itens");

  const getExpiredItems = (items: foodItem[], id: string) => {
    return items.filter((item) => {
      const expirationDate = new Date(item.data_validade);

      return expirationDate.getTime() < new Date().getTime() && item.id_ambiente === id;
    });
  };

  const getExpiringItems = (items: foodItem[], id: string) => {
    return items.filter((item) => {
      const expirationDate = new Date(item.data_validade);
      const notExpired = expirationDate.getDate() >= new Date().getDate();

      return notExpired && expirationDate.getDate() - new Date().getDate() <= 7 && item.id_ambiente === id;
    });
  };

  const getOpenItems = (items: foodItem[], id: string) => {
    return [
      ...items.filter(
        (item) => item.status === "Aberto" && item.id_ambiente === id
      ),
    ];
  };

  const getLeftovers = (items: foodItem[]) => {
    return [];
  };

  async function fetchItemsFromLocation(
    field: string = "",
    value: string = ""
  ) {

    console.log("Buscando itens de", location)
    const { id } = await getLocationId(location);
    const { data, error } = await supabase
      .from("Alimentos")
      .select("*")
      .eq("id_ambiente", id)
      .eq(field, value);

    if (error) {
      throw Error(error.message);
    }

    switch (group) {
        case "open":
          const openItems = getOpenItems(data, id);
          setFoodList(openItems);
          setHeaderTitle("Itens Abertos");
          break;
        case "expiring":
          const expiringItems = getExpiringItems(data, id);
          setFoodList(expiringItems);
          setHeaderTitle("Itens Vencendo");
          break;
        case "expired":
          const expiredItems = getExpiredItems(data, id);
          setFoodList(expiredItems);
          setHeaderTitle("Itens Vencidos");
          break;
        case "leftovers":
          setHeaderTitle("Sobras");
          break;
        default:
          setFoodList(data);
          setHeaderTitle("Todos os itens");
          break;
      }

    
  }

  useEffect(() => {
    console.log("Novo ID detectado:", group);
    console.log(location);
    fetchItemsFromLocation();
  }, [location, group]);

  return (
    <>
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.setParams({});
                router.replace("/main/home")
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          ),
          title: headerTitle,
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
            alignItems: "center",
          },
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar placeholder="Pesquisar itens..." />
        <LocationButtonGroup onSelect={(val) => setLocation(val)} />
        <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
        <ScrollView>
          <View style={styles.foodItemsGrid}>
            {foodList.map((item: foodItem) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={{ width: "48%" }}
                  onPress={() =>
                    router.push({
                      pathname: "/main/home/itemView",
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

export default Inventory;
