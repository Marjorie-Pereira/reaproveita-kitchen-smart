import Card from "@/components/Card";
import { FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
        <Card icon={<Ionicons name="calendar-outline" size={24} color="black" />} label="Vencendo" />
        <Card icon={<Ionicons name="alert-circle-outline" size={24} color="black" />} label="Vencidos" />
        <Card icon={<Fontisto name="test-bottle" size={24} color="black" />} label="Abertos" />
        <Card icon={<MaterialCommunityIcons name="food-drumstick-outline" size={24} color="black" />} label="Sobras" />
      </View>

      {/* Section: Todos os itens */}
      <View style={styles.itemsHeader}>
        <Text style={styles.sectionTitle}>Todos os itens</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Ionicons name="arrow-forward-sharp" size={18} color="#C95CA5" />
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemsGrid}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.itemBox}>
            <FontAwesome6 name="jar" size={24} color="#5C9C59" />
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
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120,
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
    backgroundColor :'#fff',
    borderRadius: 50,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  viewAllText: {
    color: "#C95CA5",
    fontWeight: "500",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8
  },
  itemBox: {
    backgroundColor: "#D9EBD8",
    width: "30%",
    height: 50,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
});
