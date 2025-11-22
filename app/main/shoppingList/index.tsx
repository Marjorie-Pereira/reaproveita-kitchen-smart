import Button from "@/components/Button";
import FloatingButton from "@/components/FloatingButton";
import InventoryModal from "@/components/InventoryModal";
import { COLORS, globalStyles } from "@/constants/theme";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRootNavigationState, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Interfaces ---
interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
}

// --- Dados Mock ---
const mockInventory: InventoryItem[] = [
  { id: "1", name: "Arroz", category: "Grãos", stock: 2 },
  { id: "2", name: "Feijão", category: "Grãos", stock: 3 },
  { id: "3", name: "Macarrão", category: "Massas", stock: 1 },
  { id: "4", name: "Tomate", category: "Vegetais", stock: 5 },
  { id: "5", name: "Cebola", category: "Vegetais", stock: 4 },
  { id: "6", name: "Leite", category: "Laticínios", stock: 2 },
  { id: "7", name: "Queijo", category: "Laticínios", stock: 1 },
  { id: "8", name: "Frango", category: "Carnes", stock: 3 },
  { id: "9", name: "Carne Moída", category: "Carnes", stock: 2 },
  { id: "10", name: "Banana", category: "Frutas", stock: 6 },
];

// --- Componentes de UI Simples (Substitutos para Shadcn/ui) ---

// const Button = ({
//   onPress,
//   style,
//   textStyle,
//   title,
//   icon,
//   disabled = false,
// }: any) => (
//   <TouchableOpacity
//     onPress={onPress}
//     style={[globalStyles.buttonBase, style, disabled && { opacity: 0.5 }]}
//     disabled={disabled}
//   >
//     {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
//     <Text style={textStyle}>{title}</Text>
//   </TouchableOpacity>
// );

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
    />
  </View>
);

// --- Componente Principal ---

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<
    Set<string>
  >(new Set());
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;

  // --- Funções da Lista de Compras ---

  const addManualItem = () => {
    if (itemName.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: itemName,
        quantity: itemQuantity || "1",
        checked: false,
      };
      setShoppingList([...shoppingList, newItem]);
      setItemName("");
      setItemQuantity("");
    }
  };

  const addFromInventory = () => {
    const itemsToAdd: ShoppingItem[] = Array.from(selectedInventoryItems).map(
      (id) => {
        const inventoryItem = mockInventory.find((item) => item.id === id);
        return {
          // Gera um ID composto para evitar colisão com novos itens manuais
          id: `inv-${Date.now()}-${id}`,
          name: inventoryItem?.name || "",
          quantity: "1", // Quantidade inicial padrão 1
          checked: false,
        };
      }
    );
    setShoppingList((prevList) => [...prevList, ...itemsToAdd]);
    setSelectedInventoryItems(new Set());
    setIsModalOpen(false);
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

  const toggleItemCheck = (id: string) => {
    setShoppingList(
      shoppingList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id));
  };

  // --- Agrupamento do Inventário (para o Modal) ---

  const groupedInventory = mockInventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
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
      onPress: () => router.navigate("/main/home/forms/barCodeScanner"),
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
            onEndEditing={addManualItem} // Usado para acionar com "Enter" no teclado
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
                  key={item.id}
                  style={[
                    globalStyles.listItem,
                    item.checked && globalStyles.checkedListItem,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => toggleItemCheck(item.id)}
                    style={styles.checkboxTouchArea}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        item.checked
                          ? styles.checkboxChecked
                          : styles.checkboxUnchecked,
                      ]}
                    >
                      {item.checked && (
                        <Feather name="check" size={16} color={COLORS.white} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.itemName,
                        item.checked && styles.itemNameChecked,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.itemQuantity,
                        item.checked && styles.itemQuantityChecked,
                      ]}
                    >
                      {item.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
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
