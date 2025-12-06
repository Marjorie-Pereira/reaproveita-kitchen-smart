import { formatExpirationDate } from "@/utils/dateFormat";
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
  expirationDate: string;
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
      <Image
        resizeMode="contain"
        source={{
          uri: image,
        }}
        style={styles.foodImage}
      />
      <View style={styles.foodInfo}>
        <View style={styles.textWrapper}>
          <Text style={styles.foodTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        <Text style={[styles.foodText, styles.textRight]}>{brand}</Text>
      </View>

      <View style={styles.foodInfo}>
        <View style={styles.textWrapper}>
          <Text style={styles.foodText} numberOfLines={1} ellipsizeMode="tail">
            {category}
          </Text>
        </View>
        <Text style={[styles.foodText, styles.textRight]}>
          {quantity} {measureUnit}
        </Text>
      </View>

      <View style={styles.expiresIn}>
        <Feather name="calendar" size={20} color="#49454F" />
        <Text style={styles.foodText}>
          {formatExpirationDate(expirationDate)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  foodContainer: {
    width: "100%",
    backgroundColor: "#EAEAEA",
    padding: 15,
    borderRadius: 12,
  },
  foodImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  foodInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    minHeight: 24,
  },
  textWrapper: {
    flex: 1,
    marginRight: 8,
  },
  textRight: {
    flexShrink: 1,
  },
  foodTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  foodText: {
    color: "#49454F",
    fontSize: 14,
  },
  expiresIn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
});

export default FoodCard;
