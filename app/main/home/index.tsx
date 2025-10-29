import Card, { labelTextColor } from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
      <View style={styles.itemsHeader}>
        <Text style={styles.sectionTitle}>Inventário</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Ionicons name="arrow-forward-sharp" size={18} color="#C95CA5" />
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemsGrid}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ width: "30%", marginBottom: 10 }}>
            <View style={styles.itemBox}>
              <ImageBackground
                source={require("@/assets/images/placeholder.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                resizeMode="cover"
              ></ImageBackground>
              {/* colocar texto aqui */}
            </View>
          </View>
        ))}
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
});
