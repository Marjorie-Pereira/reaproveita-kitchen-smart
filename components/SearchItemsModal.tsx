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
import Button from "./Button";
import SearchBar from "./SearchBar";

export interface FoodItem {
  id: string;
  nome: string;
  categoria: string;
  imagem?: string;
  local: string;
}

interface SearchItemsModalProps {
  isVisible: boolean;
  onClose: () => void;
  groupedInventory: Record<string, FoodItem[]>;
  onItemPress: (id: string) => void;
  searchBarPlaceholder?: string;
}

const SearchItemsModal: React.FC<SearchItemsModalProps> = ({
  isVisible,
  onClose,
  onItemPress,
  searchBarPlaceholder,

  groupedInventory,
}) => {
  return (
    <Modal
      visible={isVisible}
      onBlur={onClose}
      onDismiss={onClose}
      allowSwipeDismissal={true}
      style={modalStyles.modal}
      animationType="slide"
    >
      <View style={[globalStyles.modalView, { paddingTop: 60 }]}>
        {/* Modal Header */}
        <View style={globalStyles.modalHeader}>
          <View style={modalStyles.headerContent}>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Feather name="x" size={20} color={COLORS.slate400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal Content */}
        <ScrollView style={modalStyles.content}>
          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontSize: 23, marginBottom: 20, fontWeight: "500" }}>
              Buscar itens do inventário
            </Text>
            <SearchBar
              value=""
              placeholder={searchBarPlaceholder}
              onChangeText={() => {}}
            />
          </View>

          <View style={{ gap: 20, marginBottom: 40 }}>
            {Object.entries(groupedInventory).map(([location, items]) => (
              <View key={location}>
                <Text style={modalStyles.locationTitle}>{location}</Text>
                <View style={{ gap: 8 }}>
                  {items.map((item) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => onItemPress(item.id)}
                        style={modalStyles.foodItem}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={modalStyles.itemName}>{item.nome}</Text>
                          <Text style={modalStyles.itemCategory}>
                            {item.categoria}
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
            onPress={onClose}
            buttonStyle={[globalStyles.outlineButton, { flex: 1 }]}
            textStyle={globalStyles.outlineButtonText}
          >
            <Text>Cancelar</Text>
          </Button>
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

  closeButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 8,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  locationTitle: {
    fontSize: 16,
    color: COLORS.slate900,
    fontWeight: "600",
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    backgroundColor: COLORS.white,
  },

  itemName: {
    color: COLORS.slate900,
    fontSize: 16,
    fontWeight: "500",
  },
  itemCategory: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
});

export default SearchItemsModal;
