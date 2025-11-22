import { COLORS, globalStyles } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
}

interface InventoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: () => void;
  groupedInventory: Record<string, InventoryItem[]>;
  selectedInventoryItems: Set<string>;
  toggleInventoryItem: (id: string) => void;
}

const Button = ({
  onPress,
  style,
  textStyle,
  title,
  disabled = false,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[globalStyles.buttonBase, style, disabled && { opacity: 0.5 }]}
    disabled={disabled}
  >
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

const InventoryModal: React.FC<InventoryModalProps> = ({
  isVisible,
  onClose,
  onAdd,
  groupedInventory,
  selectedInventoryItems,
  toggleInventoryItem,
}) => {
  const selectedCount = selectedInventoryItems.size;

  return (
    <Modal
      visible={isVisible}
      onBlur={onClose}
      onDismiss={onClose}
      allowSwipeDismissal={true}
      style={modalStyles.modal}
      animationType="slide"
    >
      <View style={globalStyles.modalView}>
        {/* Modal Header */}
        <View style={globalStyles.modalHeader}>
          <View style={modalStyles.headerContent}>
            <View>
              <Text style={modalStyles.title}>Selecione os Alimentos</Text>
              <Text style={modalStyles.subtitle}>
                Escolha os alimentos do seu inventário para adicionar à lista de
                compras.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Feather name="x" size={20} color={COLORS.slate400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal Content */}
        <ScrollView style={modalStyles.content}>
          <View style={{ gap: 20 }}>
            {Object.entries(groupedInventory).map(([category, items]) => (
              <View key={category}>
                <Text style={modalStyles.categoryTitle}>{category}</Text>
                <View style={{ gap: 8 }}>
                  {items.map((item) => {
                    const isSelected = selectedInventoryItems.has(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleInventoryItem(item.id)}
                        style={modalStyles.inventoryItem}
                      >
                        <View style={modalStyles.checkboxContainer}>
                          <View
                            style={[
                              modalStyles.checkbox,
                              isSelected
                                ? modalStyles.checkboxChecked
                                : modalStyles.checkboxUnchecked,
                            ]}
                          >
                            {isSelected && (
                              <Feather
                                name="check"
                                size={12}
                                color={COLORS.white}
                              />
                            )}
                          </View>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={modalStyles.itemName}>{item.name}</Text>
                          <Text style={modalStyles.itemStock}>
                            Estoque: {item.stock}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Modal Footer */}
        <View style={globalStyles.modalFooter}>
          <Button
            title="Cancelar"
            onPress={onClose}
            style={[globalStyles.outlineButton, { flex: 1 }]}
            textStyle={globalStyles.outlineButtonText}
          />
          <Button
            title={`Adicionar (${selectedCount})`}
            onPress={onAdd}
            disabled={selectedCount === 0}
            style={[globalStyles.primaryButton, { flex: 1 }]}
            textStyle={globalStyles.primaryButtonText}
          />
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    color: COLORS.slate900,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 4,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 8,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  categoryTitle: {
    fontSize: 16,
    color: COLORS.slate900,
    fontWeight: "600",
    marginBottom: 8,
  },
  inventoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    backgroundColor: COLORS.white,
  },
  checkboxContainer: {
    // Para centralizar o Checkbox
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
    color: COLORS.slate900,
    fontSize: 16,
    fontWeight: "500",
  },
  itemStock: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
});

export default InventoryModal;
