import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type FoodCardProps = {
  image?: any;
  title: string;
  brand: string;
  category: string;
  quantity: number;
  measureUnit: string;
  expirationDate: Date;
};

const FoodCard = (props: FoodCardProps) => {
  const {
    image = "",
    title,
    brand,
    category,
    quantity,
    measureUnit,
    expirationDate,
  } = props;
  return (
    <View style={styles.foodContainer}>
      <Image source={image} style={{ alignSelf: "center", marginBottom: 8 }} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle}>{title}</Text>
        <Text style={styles.foodText}>{brand}</Text>
      </View>

      <View style={styles.foodInfo}>
        <Text style={styles.foodText}>{category}</Text>
        <Text style={styles.foodText}>
          {quantity} {measureUnit}
        </Text>
      </View>

      <View style={styles.expiresIn}>
        <Feather name="calendar" size={20} color="#49454F" />
        <Text style={styles.foodText}>
          {expirationDate.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  foodContainer: {
    width: "47%",
    backgroundColor: "#EAEAEA",
    padding: 15,
    borderRadius: 12,
  },
  foodInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  foodTitle: {
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 5,
  },
  foodText: {
    color: "#49454F",
  },
  expiresIn: {
    flexDirection: "row",
    gap: 4,
  },
});

export default FoodCard;
