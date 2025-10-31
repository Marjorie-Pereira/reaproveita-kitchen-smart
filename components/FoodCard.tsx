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
      <Image
        source={{
          uri: image,
        }}
        style={{
          alignSelf: "center",
          marginBottom: 8,
          width: "100%",
          height: "100%",
        }}
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
  // 1. ESTILO DE IMAGEM CORRIGIDO
  foodImage: {
    width: "100%", // Ocupa 100% da largura do container (com padding)
    aspectRatio: 1, // Mantém a proporção (1:1 = quadrado)
    borderRadius: 8, // Arredonda os cantos da imagem
    marginBottom: 10, // Aumenta o espaço abaixo da imagem
  },
  foodInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, // Espaçamento consistente
    minHeight: 24, // Garante altura mínima para alinhamento
  },
  // 2. WRAPPER PARA O TEXTO DA ESQUERDA
  textWrapper: {
    flex: 1, // Permite que esta View cresça e ocupe o espaço
    marginRight: 8, // Adiciona um espaço antes do texto da direita
  },
  // 3. ESTILO PARA O TEXTO DA DIREITA
  textRight: {
    flexShrink: 1, // Permite que o texto da direita encolha se necessário
  },
  foodTitle: {
    fontWeight: "bold",
    fontSize: 16, // Aumenta um pouco para dar hierarquia
    color: "#333", // Um pouco mais escuro para o título
  },
  foodText: {
    color: "#49454F",
    fontSize: 14,
  },
  expiresIn: {
    flexDirection: "row",
    alignItems: "center", // Alinha o ícone ao texto
    gap: 4,
    marginTop: 5, // Adiciona um espaço acima da data
  },
});

export default FoodCard;
