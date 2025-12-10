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
  const [value, setValue] = useState<string | number>(initialValue);

  const handleIncrement = () => {
    const newValue = Math.min((value as number) + step, max);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max((value as number) - step, min);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleTextChange = (text: string) => {
    const number = parseInt(text, 10);

    if (!isNaN(number)) {
      const clampedValue = Math.min(Math.max(number, min), max);
      setValue(clampedValue);
      if (onChange) {
        onChange(clampedValue);
      }
    } else if (text === "") {
     
      setValue(text);
    }
  };

  const displayValue = typeof value === "number" ? value.toString() : value;

  useEffect(() => {
   
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
    overflow: "hidden",
    width: 150,
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
    flex: 1,
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
