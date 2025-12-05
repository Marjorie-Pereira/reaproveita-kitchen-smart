import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  ref?: React.RefObject<TextInput | null>
  editable?: boolean
}
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Buscar...",
  onPress = () => null,
  ref,
  editable = true
 
}: SearchBarProps) => {
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#688067"
        onPress={onPress}
        ref={ref}
        clearButtonMode="always"
        autoCapitalize="none"
        editable={editable}
      />

      <Feather name="search" size={22} color="#333" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#e0ebe0ff",
    borderRadius: 30,

    paddingHorizontal: 20,
    height: 50,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginRight: 10,
  },
});

export default SearchBar;
