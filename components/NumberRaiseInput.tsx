import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NumberRaiseInputProps {
  initialValue?: number | string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}
const NumberRaiseInput = ({
  initialValue = 0,
  step = 1,
  min = -Infinity,
  max = Infinity,
  onChange,
}: NumberRaiseInputProps) => {
  // Estado para armazenar o valor atual do input
  const [value, setValue] = useState<string | number>(initialValue);

  // Função para lidar com o aumento do valor
  const handleIncrement = () => {
    const newValue = Math.min((value as number) + step, max);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Função para lidar com a diminuição do valor
  const handleDecrement = () => {
    const newValue = Math.max((value as number) - step, min);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Função para lidar com a mudança direta no TextInput
  const handleTextChange = (text: string) => {
    const number = parseInt(text, 10);

    // Verifica se é um número válido e limita dentro do min/max
    if (!isNaN(number)) {
      const clampedValue = Math.min(Math.max(number, min), max);
      setValue(clampedValue);
      if (onChange) {
        onChange(clampedValue);
      }
    } else if (text === "") {
      // Permite apagar o texto temporariamente, mas mantém o estado sem notificar onChange ainda
      setValue(text);
    }
  };

  // Garante que o valor exibido é uma string
  const displayValue = typeof value === "number" ? value.toString() : value;

  useEffect(() => {
    // Garante que o estado interno do input reflete a prop externa.
    // É importante apenas se initialValue realmente mudar.
    if (initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <View style={styles.container}>
      {/* Botão Diminuir (-) */}
      <TouchableOpacity
        style={[
          styles.button,
          (value as number) <= min && styles.disabledButton,
        ]}
        onPress={handleDecrement}
        disabled={(value as number) <= min}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      {/* Input de Texto */}
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange}
        value={displayValue}
        keyboardType="numeric"
        textAlign="center"
      />

      {/* Botão Aumentar (+) */}
      <TouchableOpacity
        style={[
          styles.button,
          (value as number) >= max && styles.disabledButton,
        ]}
        onPress={handleIncrement}
        disabled={(value as number) >= max}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden", // Para garantir que os cantos do container sejam arredondados
    width: 150, // Largura total do componente
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  disabledButton: {
    backgroundColor: "#eee",
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    flex: 1, // Faz com que o input ocupe o espaço restante
    padding: 0,
    fontSize: 16,
    height: 40,
    minWidth: 40,
    borderColor: "#ccc",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});

export default NumberRaiseInput;
