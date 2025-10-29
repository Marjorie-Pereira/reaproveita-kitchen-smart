import { FoodListItemProps } from "@/types/FoodListItemProps";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

const FoodListItem = ({
  imageUri,
  name,
  brand,
  category,
  volume,
  status,
  statusColor = "#FFFADD", // Cor padrão para o status, se não for fornecida
}: FoodListItemProps) => {
  return (
    <View style={styles.container}>
      {/* Imagem do Produto */}
      <Image
        source={{ uri: imageUri }}
        style={styles.productImage}
        resizeMode="contain" 
      />

      {/* Detalhes do Produto (Nome, Marca, Categoria, Volume) */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productBrand}>{brand}</Text>
        <Text style={styles.productCategory}>{category}</Text>
        <Text style={styles.productVolume}>{volume}</Text>
      </View>

      {/* Status (Vencendo) - Condicionalmente renderizado */}
      {status && ( 
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    width: '100%'
  },
  productImage: {
    width: 60, 
    height: 80, 
    marginRight: 15, 
  },
  detailsContainer: {
    flex: 1, 
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
  },
  productCategory: {
    fontSize: 14,
    color: "#888",
  },
  productVolume: {
    fontSize: 12,
    color: "#888",
    marginTop: 5, 
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10, 
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6F4E37",
  },
});

export default FoodListItem;
