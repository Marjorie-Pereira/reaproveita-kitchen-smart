import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const COLORS = {
  primary: "rgba(90, 156, 92, 1)",
  primaryLight: "rgba(90, 156, 92, 0.15)",
  seconday: "rgba(181, 63, 132, 1)",
  secondaryLight: "rgba(181, 63, 132, 0.2)",
  background: "#f4f0f4",
  label: "#6b4f6b",
  border: "#d3c8d3",
  text: "#333",
  white: "#fff",
  placeholder: "#888",
  danger: "#d25353ff",
  slate900: "#0F172A",
  slate600: "#475569",
  slate500: "#64748B",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate200: "#E2E8F0",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",
  blue50: "#EFF6FF",
  blue800: "#1E40AF",
  blue200: "#BFDBFE",
  red500: "#EF4444",
  red600: "#DC2626",
  red50: "#FEF2F2",
  black: "#000000",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Elementos de UI
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonBase: {
    borderRadius: 8,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  outlineButtonText: {
    color: COLORS.slate600,
    fontSize: 16,
    fontWeight: "600",
  },
  ghostButton: {
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 6,
  },
  // Formulário
  label: {
    fontSize: 14,
    color: COLORS.slate600,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.slate300,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  // Cabeçalho
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    zIndex: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // Abas
  tabContainer: {
    backgroundColor: COLORS.slate100,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    transitionDuration: "300",
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Itens da Lista
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    backgroundColor: COLORS.white,
  },
  checkedListItem: {
    backgroundColor: COLORS.slate50,
  },
  // Modal (Estilos para react-native-modal)
  modalView: {
    backgroundColor: COLORS.white,
    width: width,
    maxHeight: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  modalFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    flexDirection: "row",
    gap: 12,
  },
});
