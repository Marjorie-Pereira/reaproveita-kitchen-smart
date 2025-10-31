import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Certifique-se de ter o expo-vector-icons instalado!
// npx expo install @expo/vector-icons
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// Definição das cores da imagem para fácil manutenção
const COLORS = {
  active: "#b53f84",
  inactive: "#f5e4ef",
  activeText: "#FFFFFF",
  inactiveText: "#505050",
  divider: "#dcb8d0",
};

const LocationButtonGroup = ({
  onSelect,
}: {
  onSelect: (val: string) => void;
}) => {
  const [activeBtn, setActiveBtn] = useState("geladeira");
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            activeBtn === "geladeira"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            setActiveBtn("geladeira");
            onSelect("Geladeira");
          }}
        >
          <MaterialCommunityIcons
            name="fridge-outline"
            size={20}
            color={
              activeBtn === "geladeira"
                ? COLORS.activeText
                : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "geladeira"
                ? styles.textActive
                : styles.textInactive,
            ]}
          >
            Geladeira
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.divider,
            activeBtn === "despensa"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            setActiveBtn("despensa");
            onSelect("Despensa");
          }}
        >
          <Feather
            name="box"
            size={20}
            color={
              activeBtn === "despensa" ? COLORS.activeText : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "despensa"
                ? styles.textActive
                : styles.textInactive,
            ]}
          >
            Despensa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeBtn === "freezer"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            setActiveBtn("freezer");
            onSelect("Freezer");
          }}
        >
          <FontAwesome5
            name="snowflake"
            size={20}
            color={
              activeBtn === "freezer" ? COLORS.activeText : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "freezer" ? styles.textActive : styles.textInactive,
            ]}
          >
            Freezer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 20,
    backgroundColor: "white",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonActive: {
    backgroundColor: COLORS.active,
  },
  buttonInactive: {
    backgroundColor: COLORS.inactive,
  },
  textActive: {
    color: COLORS.activeText,
  },
  textInactive: {
    color: COLORS.inactiveText,
  },

  divider: {
    borderRightWidth: 1,
    borderColor: COLORS.divider,
  },
});

export default LocationButtonGroup;
