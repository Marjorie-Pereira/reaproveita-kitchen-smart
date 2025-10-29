import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
// Usaremos o ícone 'search' do pacote Feather
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, placeholder = "Buscar..." }: any) => {
  return (
    <View style={styles.container}>
      {/* O TextInput ocupa a maior parte do espaço */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#688067" // Uma cor de placeholder que combina
      />
      
      {/* O ícone de lupa fica à direita */}
      <Feather 
        name="search" 
        size={22} 
        color="#333" 
       
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    
    backgroundColor: '#e0ebe0ff', 
    borderRadius: 30,          
    
    paddingHorizontal: 20, 
    height: 50,
    
   
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    color: '#000',
    marginRight: 10, 
  },
  
});

export default SearchBar;