import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import ItemForm from "@/components/ItemForm";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { foodItem } from "@/types/FoodListItemProps";
import { getLocationId } from "@/utils/locationUtils";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const groupMap = {
  leftovers: "Sobras",
  expiring: "Itens Vencendo",
  expired: "Itens Vencidos",
  open: "Itens Abertos",
  all: "Todos os itens",
};

const Inventory = () => {
  const { group } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const path = usePathname();
  const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
    {
      label: "Cadastrar",
      icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
      onPress: () => setIsModalOpen(true),
    },
    {
      label: "Escanear",
      icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
      onPress: () => null,
    },
  ];

  const [location, setLocation] = useState("Geladeira");
  const [foodList, setFoodList] = useState<foodItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getExpiredItems = (items: foodItem[], id: string) => {
    return items.filter((item) => {
      const expirationDate = new Date(item.data_validade);

      return (
        expirationDate.getTime() < new Date().getTime() &&
        item.id_ambiente === id
      );
    });
  };

  const getExpiringItems = (items: foodItem[], id: string) => {
    return items.filter((item) => {
      const expirationDate = new Date(item.data_validade);
      const notExpired = expirationDate.getDate() >= new Date().getDate();

      return (
        notExpired &&
        expirationDate.getDate() - new Date().getDate() <= 7 &&
        item.id_ambiente === id
      );
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

  async function handleAddItem(item: foodItem) {
    const { error } = await supabase.from("Alimentos").insert({
      ...item,
    });

    if (error) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
    } else {
      Alert.alert("Alimento Adicionado");
      setIsModalOpen(false);
    }
  }

  async function fetchItemsFromLocation(
    field: string = "",
    value: string = ""
  ) {
    console.log("Buscando itens de", location);
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

        break;
      case "expiring":
        const expiringItems = getExpiringItems(data, id);
        setFoodList(expiringItems);

        break;
      case "expired":
        const expiredItems = getExpiredItems(data, id);
        setFoodList(expiredItems);
        break;
      case "leftovers":
        break;
      default:
        setFoodList(data);
        break;
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log("entrou na telas");
      console.log("params de group", params);
      fetchItemsFromLocation();

      return () => {};
    }, [])
  );

  useEffect(() => {
    console.log("Remontando");
    fetchItemsFromLocation();
  }, [location, group]);

  useEffect(() => {
    console.log("Remontando");
    if (!isModalOpen) fetchItemsFromLocation();
  }, [isModalOpen]);

  // useEffect(() => {
  //   console.log("Remontando");
  // }, [foodList]);

  return (
    <>
      <Stack.Screen
        options={{
          title: groupMap[group as keyof typeof groupMap],
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
                    router.navigate({
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
      <Modal
        visible={isModalOpen}
        onBlur={() => setIsModalOpen(false)}
        onDismiss={() => setIsModalOpen(false)}
        allowSwipeDismissal={true}
        style={styles.modal}
        animationType="slide"
      >
        <ItemForm
          variant="new"
          onSubmit={handleAddItem}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
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

export default Inventory;
