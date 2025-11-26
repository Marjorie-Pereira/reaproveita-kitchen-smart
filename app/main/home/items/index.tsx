import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import ItemForm from "@/components/ItemForm";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import ScannerModal from "@/components/ScannerModal";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { foodItem } from "@/types/FoodListItemProps";
import { productType } from "@/types/openFoodApiResponse";
import { getLocationId } from "@/utils/locationUtils";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { useCallback, useState } from "react";
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

import { subDays } from "date-fns";

const Inventory = () => {
  const { group } = useLocalSearchParams();

  const [location, setLocation] = useState<string>("Geladeira");
  const [foodList, setFoodList] = useState<foodItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<productType | undefined>(
    undefined
  );
  const [buttonGroupValue, setButtonGroupValue] = useState(location);
  const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
    {
      label: "Cadastrar",
      icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
      onPress: () => setIsModalOpen(true),
    },
    {
      label: "Escanear",
      icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
      onPress: () => setIsScannerOpen(true),
    },
  ];
  const getExpiredItems = (items: foodItem[], id: string) => {
    return items.filter((item) => {
      const expirationDate = new Date(item.data_validade);
      const expDateLocal = subDays(expirationDate, 1);

      return (
        expDateLocal.getTime() < new Date().getTime() && item.id_ambiente === id
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
      fetchItemsFromLocation();
    }
  }

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

  async function getByGroup(
    group: string,
    items: foodItem[],
    location: string
  ) {
    if (!location) return;
    console.log("getting by the group of", group);
    const { id } = await getLocationId(location);
    switch (group) {
      case "open":
        const openItems = getOpenItems(items, id);
        return openItems;

      case "expiring":
        const expiringItems = getExpiringItems(items, id);
        return expiringItems;

      case "expired":
        const expiredItems = getExpiredItems(items, id);
        return expiredItems;

      case "leftovers":
        break;
      default:
        break;
    }
  }

  function getFilteredByGroup(group: string, items: foodItem[], id: string) {
    switch (group) {
      case "open":
        return getOpenItems(items, id);

      case "expiring":
        return getExpiringItems(items, id);

      case "expired":
        return getExpiredItems(items, id);

      default:
        return items;
    }
  }

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // 1) Pegue o id da location UMA VEZ
        const { id } = await getLocationId(location ?? "Geladeira");

        // 2) Busque todos os itens da location
        let items = await fetchItemsFromLocation("id_ambiente", id);

        // 3) Aplique FILTROS localmente (não no banco)
        if (group && group !== "all") {
          items = getFilteredByGroup(group as string, items, id);
        }

        // 4) Atualize o estado uma única vez
        setFoodList(items);
      };

      load();
    }, [group, location])
  );

  // useEffect(() => {
  //   setButtonGroupValue(location);
  //   fetchItemsFromLocation();
  // }, [location]);

  // useEffect(() => {
  //   if (isModalOpen) return;
  // }, [isModalOpen]);

  // useEffect(() => {
  //   console.log("Remontando");
  // }, [foodList]);

  // useEffect(() => {
  //   fetchItems()
  // }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     // if (!location) setLocation("Geladeira");

  //     fetchItemsFromLocation();

  //     return () => {};
  //   }, [location])
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     // if (!location) setLocation("Geladeira");

  //     console.log("grupo", group);

  //     fetchItemsFromLocation();
  //     getByGroup(group as string, foodList);

  //     return () => {};
  //   }, [group, location])
  // );

  const handleScanned = (scannedItem: productType) => {
    setScannedItem(scannedItem);
    setIsScannerOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: groupMap[group as keyof typeof groupMap],
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 20, gap: 20 }}>
        <SearchBar placeholder="Pesquisar itens..." />
        <LocationButtonGroup
          onSelect={(val) => setLocation(val)}
          activeBtn={location}
        />
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
          scanned={scannedItem}
        />
      </Modal>
      <ScannerModal
        isVisible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanned}
      />
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
