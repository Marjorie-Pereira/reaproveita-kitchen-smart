import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const COLORS = {
  active: "#b53f84",
  inactive: "#f5e4ef",
  activeText: "#FFFFFF",
  inactiveText: "#505050",
  divider: "#dcb8d0",
};

const LocationButtonGroup = ({
  onSelect,
  activeBtn = "Geladeira",
}: {
  onSelect: (val: string) => void;
  activeBtn?: string;
}) => {
  // useEffect(() => {
  //   console.log("active buton", activeBtn);
  // }, [activeBtn, onSelect]);

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            activeBtn === "Geladeira"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            onSelect("Geladeira");
          }}
        >
          <MaterialCommunityIcons
            name="fridge-outline"
            size={20}
            color={
              activeBtn === "Geladeira"
                ? COLORS.activeText
                : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "Geladeira"
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
            activeBtn === "Despensa"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            onSelect("Despensa");
          }}
        >
          <Feather
            name="box"
            size={20}
            color={
              activeBtn === "Despensa" ? COLORS.activeText : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "Despensa"
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
            activeBtn === "Freezer"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            onSelect("Freezer");
          }}
        >
          <FontAwesome5
            name="snowflake"
            size={20}
            color={
              activeBtn === "Freezer" ? COLORS.activeText : COLORS.inactiveText
            }
          />
          <Text
            style={[
              styles.text,
              activeBtn === "Freezer" ? styles.textActive : styles.textInactive,
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
    paddingHorizontal: 12,
    width: "34%",
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
