// no seu (novo) arquivo, ex: components/DatePickerInput.js
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Reutilizando as cores que definimos na tela do formulário
const COLORS = {
  label: "#6b4f6b",
  border: "#d3c8d3",
  text: "#333",
  white: "#fff",
  placeholder: "#888",
};

// Nosso novo componente
const DatePickerInput = ({ label, value, onChange }: any) => {
  // Estado para controlar a visibilidade do seletor
  const [showPicker, setShowPicker] = useState(false);

  // Função chamada quando a data é alterada no seletor
  const onDateChange = (event: any, selectedDate: any) => {
    // Escondemos o seletor (no Android, isso é necessário após a seleção)
    setShowPicker(Platform.OS === "ios");

    // Se o usuário pressionar "Cancelar" no Android, selectedDate será undefined
    if (selectedDate) {
      onChange(selectedDate); // Passa a nova data para o componente pai
    }
    // No iOS, o usuário precisa de um botão "Confirmar",
    // mas para simplificar, vamos aceitar a data "ao vivo".
    // Para uma UI mais robusta no iOS, você colocaria
    // o Picker dentro de um Modal com um botão "Confirmar".
    // Mas para este caso, o `onChange` direto é mais simples.

    // Para Android, escondemos imediatamente após a seleção
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
  };

  // Formata a data para "dd/MM/yyyy"
  const formatDate = (date: Date) => {
    if (!date) return "Input"; // O placeholder original

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      {/* O "Input" clicável */}
      <TouchableOpacity
        style={styles.pickerWrapper}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {formatDate(value)}
        </Text>
        <Ionicons name="calendar-outline" size={22} color={COLORS.label} />
      </TouchableOpacity>

      {/* O Componente DatePicker (só é exibido quando showPicker = true) */}
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value || new Date()} // Deve ser um objeto Date. Usa data atual se 'value' for null
          mode="date"
          is24Hour={true}
          display="default" // 'default' usa o melhor modo para a plataforma/versão
          onChange={onDateChange}
          locale="pt-BR" // Para garantir o idioma
        />
      )}
    </View>
  );
};

// --- ESTILOS ---
// (Estes são os mesmos estilos do seu formulário para consistência)
const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.label,
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 52,
    paddingHorizontal: 15,
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
});

export default DatePickerInput;
