import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Card({ icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity style={styles.card}>
      {icon}
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    card: {
    backgroundColor: "#F3F7F3",
    width: "47%",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 12,
    elevation: 2,
  },
  cardLabel: {
    marginTop: 8,
    fontWeight: "500",
    color: "#333",
  },
})