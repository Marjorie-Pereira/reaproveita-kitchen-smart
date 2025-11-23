import Button from "@/components/Button";
import FloatingButton from "@/components/FloatingButton";
import InventoryModal from "@/components/InventoryModal";
import { COLORS, globalStyles } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { productType } from "@/types/openFoodApiResponse";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Interfaces ---
interface ShoppingItem {
  id?: string;
  name: string;
  quantity: number;
  checked: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: string;
}

const Card = ({ children, style }: any) => (
  <View style={[globalStyles.card, style]}>{children}</View>
);

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onEndEditing,
  keyboardType = "default",
}: any) => (
  <View style={{ marginBottom: 12 }}>
    {label && <Text style={globalStyles.label}>{label}</Text>}
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onSubmitEditing={onEndEditing}
      style={globalStyles.input}
      placeholderTextColor={COLORS.slate400}
      keyboardType={keyboardType}
    />
  </View>
);

// --- Componente Principal ---

function ShoppingList() {
  const params = useLocalSearchParams();

  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<
    Set<string>
  >(new Set());
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;
  const { user } = useAuth();

  const getShoppingListId = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ListasCompras")
      .select("id")
      .eq("id_usuario", user?.id);
    if (error) throw new Error(error.message);
    return data[0]?.id;
  };

  const fetchShoppingListItems = async () => {
    const listId = await getShoppingListId();
    if (!listId) return;
    const { data, error } = await supabase
      .from("ItensListaCompras")
      .select("*")
      .eq("id_lista", listId)
      .order("id", { ascending: false });
    if (error) throw new Error(error.message);

    setShoppingList(data);
  };

  const fetchItemsFromInventory = async () => {
    const { data, error } = await supabase.from("Alimentos").select("*");

    if (error) throw new Error(error.message);
    setInventoryItems(data);
  };

  useEffect(() => {
    console.log("shopping list changed");
  }, [shoppingList]);

  useFocusEffect(
    useCallback(() => {
      console.log(params);
      if (params.scannedProduct) {
        const scannedProduct: productType = JSON.parse(
          params?.scannedProduct as string
        );
        setItemName(scannedProduct.product_name);
        console.log(scannedProduct);
      }
      fetchShoppingListItems();
      fetchItemsFromInventory();
      return () => {
        console.log("saiu");
      };
    }, [])
  );

  // --- Funções da Lista de Compras ---

  const addManualItem = async () => {
    const listId = await getShoppingListId();
    if (itemName.trim()) {
      const newItem: ShoppingItem = {
        name: itemName,
        quantity: itemQuantity || 0,
        checked: false,
      };

      console.log("shopping list", listId);
      const { error } = await supabase.from("ItensListaCompras").insert({
        item: newItem.name,
        quantidade: newItem.quantity,
        comprado: newItem.checked,
        id_lista: listId,
      });
      if (error) {
        throw new Error(error.message);
      } else {
        Alert.alert("ok");
      }

      setItemName("");
      setItemQuantity(null);
      fetchShoppingListItems();
    }
  };

  const addFromInventory = async () => {
    const listId = await getShoppingListId();
    const itemsToAdd = Array.from(selectedInventoryItems).map((id) => {
      const inventoryItem = inventoryItems.find((item) => item?.id === id);
      return {
        // Gera um ID composto para evitar colisão com novos itens manuais
        item: inventoryItem?.nome || "",
        quantidade: 1, // Quantidade inicial padrão 1
        comprado: false,
        id_lista: listId,
      };
    });

    const { error } = await supabase
      .from("ItensListaCompras")
      .insert(itemsToAdd);
    if (error) {
      throw new Error(error.message);
    } else {
      Alert.alert("ok");
    }

    setSelectedInventoryItems(new Set());
    setIsModalOpen(false);
    fetchShoppingListItems();
  };

  const toggleInventoryItem = (id: string) => {
    setSelectedInventoryItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const toggleItemCheck = async (id: string, currValue: any) => {
    const { error } = await supabase
      .from("ItensListaCompras")
      .update({ comprado: !currValue })
      .eq("id", id);
    if (error) throw new Error(error.message);
    fetchShoppingListItems();
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("ItensListaCompras")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    fetchShoppingListItems();
  };

  // --- Agrupamento do Inventário (para o Modal) ---

  const groupedInventory = inventoryItems.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const buttonActions: buttonActionsObject[] = [
    {
      icon: <Feather name="box" size={24} color="black" />,
      label: "Inventário",
      onPress: () => setIsModalOpen(true),
    },
    {
      icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
      label: "Escanear",
      onPress: () => router.navigate("/main/shoppingList/scanBarCode"),
    },
  ];

  return (
    <>
      <FloatingButton actions={buttonActions} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.listTitle}>Adicionar Itens Manualmente</Text>
        <Card style={styles.manualCard}>
          <Input
            label="Nome do Alimento"
            placeholder="Ex: Arroz, Feijão, Tomate..."
            value={itemName}
            onChangeText={setItemName}
          />
          <Input
            label="Quantidade"
            placeholder="Ex: 2kg, 1L, 3 unidades..."
            value={itemQuantity}
            onChangeText={setItemQuantity}
            onEndEditing={addManualItem}
            keyboardType="numeric"
          />
          <Button
            onPress={addManualItem}
            buttonStyle={globalStyles.primaryButton}
            textStyle={globalStyles.primaryButtonText}
            // disabled={!itemName.trim()}
          >
            <Feather name="plus" size={16} color={COLORS.white} />
            <Text style={[globalStyles.tabText, { color: COLORS.white }]}>
              Adicionar à Lista
            </Text>
          </Button>
        </Card>

        {/* Shopping List */}
        <View>
          <Text style={styles.listTitle}>Minha Lista</Text>
          {shoppingList.length === 0 ? (
            <Card style={styles.emptyListCard}>
              <Feather
                name="shopping-cart"
                size={48}
                color={COLORS.slate300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyListText}>Sua lista está vazia</Text>
              <Text style={styles.emptyListSubtext}>
                Adicione itens para começar
              </Text>
            </Card>
          ) : (
            <View style={{ gap: 8 }}>
              {shoppingList.map((item) => (
                <Card
                  key={item?.id}
                  style={[
                    globalStyles.listItem,
                    item.comprado && globalStyles.checkedListItem,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      toggleItemCheck(item?.id as string, item?.comprado)
                    }
                    style={styles.checkboxTouchArea}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        item.comprado
                          ? styles.checkboxChecked
                          : styles.checkboxUnchecked,
                      ]}
                    >
                      {item.comprado && (
                        <Feather name="check" size={16} color={COLORS.white} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.itemName,
                        item.comprado && styles.itemNameChecked,
                      ]}
                    >
                      {item.item}
                    </Text>
                    <Text
                      style={[
                        styles.itemQuantity,
                        item.comprado && styles.itemQuantityChecked,
                      ]}
                    >
                      {item?.quantidade}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item?.id as string)}
                    style={[globalStyles.ghostButton, styles.removeButton]}
                  >
                    <Feather name="trash-2" size={16} color={COLORS.red500} />
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal Overlay */}
      <InventoryModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addFromInventory}
        groupedInventory={groupedInventory}
        selectedInventoryItems={selectedInventoryItems}
        toggleInventoryItem={toggleInventoryItem}
      />
    </>
  );
}
export default ShoppingList;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Espaço extra no final
  },
  manualCard: {
    padding: 16,
    marginBottom: 24,
  },
  inventoryInfoCard: {
    padding: 16,
    backgroundColor: COLORS.blue50,
    borderColor: COLORS.blue200,
  },
  inventoryInfoText: {
    fontSize: 14,
    color: COLORS.blue800,
    lineHeight: 20,
  },
  listTitle: {
    fontSize: 16,
    color: COLORS.slate900,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyListCard: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    color: COLORS.slate500,
    fontSize: 16,
  },
  emptyListSubtext: {
    color: COLORS.slate400,
    fontSize: 14,
    marginTop: 4,
  },
  checkboxTouchArea: {
    padding: 4, // Aumenta a área de toque
    margin: -4, // Compensa o padding para manter o alinhamento visual
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxUnchecked: {
    borderColor: COLORS.slate300,
  },
  itemName: {
    fontSize: 16,
    color: COLORS.slate900,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: COLORS.slate400,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
  itemQuantityChecked: {
    color: COLORS.slate300,
  },
  removeButton: {
    // Estilo para hover (simulado, RN não tem hover)
    padding: 8,
    backgroundColor: "transparent",
  },
});
