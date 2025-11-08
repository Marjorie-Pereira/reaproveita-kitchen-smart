import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InfoRow = ({ iconName, label, value }: any) => (
  <View style={styles.infoRow}>
    <MaterialIcons
      name={iconName}
      size={24}
      color="#555"
      style={styles.infoIcon}
    />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const TelaAlimento = () => {
  const params = useLocalSearchParams();
  const [location, setLocation] = useState("");
  async function getLocationById(id: string) {
    const { data, error } = await supabase
      .from("Ambientes")
      .select("nome")
      .eq("id", id);

    if (error) {
      throw Error(error.message);
    }

    setLocation(data[0].nome);
  }

  getLocationById(params.id_ambiente as string);

  async function handleEdit() {
    router.push({ pathname: "/main/home/forms/editFoodItem", params: {...params} });
  }

  function handleDelete() {
    Alert.alert(
      "Confirmar Exclusão",

      "Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",

      [
        {
          text: "Não",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            const { data, error } = await supabase
              .from("Alimentos")
              .delete()
              .eq("id", params.id);

            if (error) {
              Alert.alert(error.message);
            } else {
              Alert.alert("Deletado com sucesso!");
              router.navigate('./inventory');
            }
          },
          style: "destructive",
        },
      ],

      {
        cancelable: true,
      }
    );
  }

  return (
    <>
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header da Seção (Item e Badge) */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>{params.nome}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Vencendo</Text>
            </View>
          </View>

          {/* Imagem do Produto */}
          <Image
            source={{
              uri: params.imagem as string,
            }}
            style={styles.image}
          />

          {/* Banner de Aviso */}
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={24} color="#B7950B" />
            <Text style={styles.warningText}>
              Vence em 2 dias - use em breve!
            </Text>
          </View>

          {/* Seção de Informações */}
          <View style={styles.infoContainer}>
            {/* Coluna da Esquerda */}
            <View style={styles.infoColumn}>
              <InfoRow
                iconName="category"
                label="Categoria"
                value={params.categoria}
              />
              <InfoRow
                iconName="bookmark-border"
                label="Marca"
                value={params.marca}
              />
              <InfoRow
                iconName="location-on"
                label="Localização"
                value={location}
              />
            </View>
            {/* Coluna da Direita */}
            <View style={styles.infoColumn}>
              <InfoRow
                iconName="inventory-2"
                label="Quantidade"
                value={`${params.quantidade} ${params.unidade_medida}`}
              />
              <InfoRow
                iconName="calendar-today"
                label="Validade"
                value={new Date(params.data_validade as string).toLocaleDateString()}
              />
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={handleEdit}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF9FA",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: "#FFF8D6",
    borderColor: "#F4DB7E",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  badgeText: {
    color: "#B9971D",
    fontSize: 12,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 8,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFBEA",
    borderColor: "#FEEA8A",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    color: "#B7950B",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoColumn: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#6DA361",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#E65353",
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TelaAlimento;
