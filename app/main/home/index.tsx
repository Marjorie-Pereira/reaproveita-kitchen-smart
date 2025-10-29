import Card from "@/components/Card";
import FoodListItem from "@/components/FoodListItem";
import SearchBar from "@/components/SearchBar";
import { labelColor, labelTextColor } from "@/constants/status.colors";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Section: Sua cozinha */}
      <Text style={styles.sectionTitle}>Sua cozinha</Text>
      <View style={styles.grid}>
        <Card
          icon={
            <Feather
              name="alert-triangle"
              size={30}
              color={labelTextColor.Vencendo}
            />
          }
          label="Vencendo"
          itemsCount={2}
        />
        <Card
          icon={
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={labelTextColor.Vencidos}
            />
          }
          label="Vencidos"
          itemsCount={2}
        />
        <Card
          icon={
            <FontAwesome5
              name="box-open"
              size={30}
              color={labelTextColor.Abertos}
            />
          }
          label="Abertos"
          itemsCount={2}
        />
        <Card
          icon={
            <MaterialCommunityIcons
              name="silverware-variant"
              size={34}
              color={labelTextColor.Sobras}
            />
          }
          label="Sobras"
          itemsCount={2}
        />
      </View>

      <SearchBar />

      {/* Section: Todos os itens */}
      <View style={styles.itemsList}>
        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>Todos os itens</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Ionicons name="arrow-forward-sharp" size={18} color="#C95CA5" />
            <Text style={styles.viewAllText}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        <View>
          <FoodListItem
            name="Leite Integral"
            brand="Piracanjuba"
            category="Laticínios"
            volume="1 litro"
            status="Vencendo"
            statusColor={labelColor.Vencendo}
            imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
          />
          <FoodListItem
            name="Leite Integral"
            brand="Piracanjuba"
            category="Laticínios"
            volume="1 litro"
            status="Vencendo"
            statusColor={labelColor.Vencendo}
            imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
          />
          <FoodListItem
            name="Leite Integral"
            brand="Piracanjuba"
            category="Laticínios"
            volume="1 litro"
            status="Vencendo"
            statusColor={labelColor.Vencendo}
            imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
          />
          <FoodListItem
            name="Leite Integral"
            brand="Piracanjuba"
            category="Laticínios"
            volume="1 litro"
            status="Vencendo"
            statusColor={labelColor.Vencendo}
            imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  viewAllBtn: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    color: "#C95CA5",
    fontWeight: "500",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  itemBox: {
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  itemsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 16,
    marginTop: 24
  }
});
