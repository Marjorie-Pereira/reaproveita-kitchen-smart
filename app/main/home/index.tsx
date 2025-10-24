import Card from "@/components/Card";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ImageBackground,
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
          icon={<Ionicons name="calendar-outline" size={44} color="#5C9C59" />}
          label="Vencendo"
        />
        <Card
          icon={
            <Ionicons name="alert-circle-outline" size={44} color="#5C9C59" />
          }
          label="Vencidos"
        />
        <Card
          icon={<Fontisto name="test-bottle" size={44} color="#5C9C59" />}
          label="Abertos"
        />
        <Card
          icon={
            <MaterialCommunityIcons
              name="food-drumstick-outline"
              size={44}
              color="#5C9C59"
            />
          }
          label="Sobras"
        />
      </View>

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
          <View key={i} style={{width: '30%', marginBottom: 10}}>
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
    marginBottom: 24,
  },

  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
