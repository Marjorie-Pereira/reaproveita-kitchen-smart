import { StyleSheet, Text, View } from 'react-native';

export default function ShoppingList() {
  return (
    <View style={styles.container}>
      <Text>Lista de compras</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
