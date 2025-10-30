import React from "react";
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

const LocationButtonGroup = () => {
  return (
    // Etapa 1: O container externo que aplica a SOMBRA.
    // A sombra não pode estar no mesmo View que 'overflow: hidden'.
    <View style={styles.shadowContainer}>
      {/* Etapa 2: O container interno que CRIA O FORMATO.
          Ele usa 'borderRadius' para arredondar o grupo
          e 'overflow: 'hidden'' para cortar os botões internos. */}
      <View style={styles.buttonGroup}>
        {/* --- Botão 1: Geladeira (Ativo) --- */}
        <TouchableOpacity style={[styles.button, styles.buttonActive]}>
          <MaterialCommunityIcons
            name="fridge-outline"
            size={20}
            color={COLORS.activeText}
          />
          <Text style={[styles.text, styles.textActive]}>Geladeira</Text>
        </TouchableOpacity>

        {/* --- Botão 2: Despensa (Inativo) --- */}
        {/* Note o 'styles.divider' para adicionar a linha da direita */}
        <TouchableOpacity
          style={[styles.button, styles.buttonInactive, styles.divider]}
        >
          <Feather name="box" size={20} color={COLORS.inactiveText} />
          <Text style={[styles.text, styles.textInactive]}>Despensa</Text>
        </TouchableOpacity>

        {/* --- Botão 3: Freezer (Inativo) --- */}
        <TouchableOpacity style={[styles.button, styles.buttonInactive]}>
          <FontAwesome5
            name="snowflake"
            size={20}
            color={COLORS.inactiveText}
          />
          <Text style={[styles.text, styles.textInactive]}>Freezer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- ESTILOS ---

const styles = StyleSheet.create({
  shadowContainer: {
    // Estilos da Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    // Deve ter o mesmo borderRadius do grupo interno
    borderRadius: 20,
    // Cor de fundo necessária para a sombra funcionar no iOS
    backgroundColor: "white",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    // Arredonda o grupo todo
    borderRadius: 20,
    // "Corta" os botões para caber no formato arredondado
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

  // Estilos de ESTADO (Ativo vs Inativo)
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

  // A linha divisória entre os botões inativos
  divider: {
    borderRightWidth: 1,
    borderColor: COLORS.divider,
  },
});

export default LocationButtonGroup;
