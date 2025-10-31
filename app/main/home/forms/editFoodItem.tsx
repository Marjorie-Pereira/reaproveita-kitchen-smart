import DatePickerInput from "@/components/DatePicker";
import { supabase } from "@/lib/supabase";
import { foodItem } from "@/types/FoodListItemProps";
import { getLocationById, getLocationId } from "@/utils/locationUtils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#5a9c5c",
  background: "#f4f0f4",
  label: "#6b4f6b",
  border: "#d3c8d3",
  text: "#333",
  white: "#fff",
  placeholder: "#888",
};

const OPCOES_UNIDADE = ["Kg", "g", "L", "ml", "Unidade(s)"];

const OPCOES_STATUS = ["Aberto", "Fechado"];

export default function AddFoodScreen() {
  const params = useLocalSearchParams() as unknown as foodItem;

  const [name, setName] = useState<string>();
  const [brand, setBrand] = useState<string>();
  const [expirationDate, setExpirationDate] = useState<null | Date>();
  const [category, setCategory] = useState<string>();
  const [price, setPrice] = useState<number | null>();
  const [quantity, setQuantity] = useState<number | null>();
  const [unit, setUnit] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [image, setImage] = useState<string | null>();

  const [location, setLocation] = useState("Geladeira");

  async function handleEditItem() {
    const { id } = await getLocationId(location);
    const { data, error } = await supabase
      .from("Alimentos")
      .update({
        nome: name,
        marca: brand,
        data_validade: expirationDate,
        categoria: category,
        preco: price,
        quantidade: quantity,
        unidade_medida: unit,
        status,
        id_ambiente: id,
        imagem: image,
      })
      .eq("id", params.id);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Alimento Editado!");
      setName("");
      setBrand("");
      setExpirationDate(null);
      setPrice(null);
      setQuantity(null);
      setImage(null);
      setCategory("Grãos");

      router.back();
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    async function getFoodItem() {
      if (!params.id) {
        return;
      }

      const { data, error } = await supabase
        .from("Alimentos")
        .select("*")
        .eq("id", params.id);

      if (error) {
        Alert.alert(error.message);
      }

      if (data && data.length > 0) {
        const item = data[0] as foodItem;
        setName(item.nome);
        setBrand(item.marca);
        setCategory(item.categoria);
        setExpirationDate(new Date(item.data_validade));
        setImage(item.imagem);
        setLocation(await getLocationById(item.id_ambiente));
        setQuantity(item.quantidade);
        setStatus(item.status);
        setUnit(item.unidade_medida);
      } else {
      }
    }

    getFoodItem();
  }, [params.id]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Tomate"
            />
            {name && name.length > 0 && (
              <TouchableOpacity onPress={() => setName("")}>
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={COLORS.placeholder}
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={brand}
              onChangeText={setBrand}
              placeholder="Ex: Heinz"
            />
          </View>
        </View>

        <DatePickerInput
          label="Data de validade"
          value={expirationDate}
          onChange={(newDate: Date) => setExpirationDate(newDate)}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={[styles.pickerWrapper]}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            style={{ backgroundColor: "white" }}
          >
            <Picker.Item label="Grãos" value="Grãos" />
            <Picker.Item label="Frutas" value="Frutas" />
            <Picker.Item label="Vegetais" value="Vegetais" />
            <Picker.Item label="Laticínios" value="Laticínios" />
            <Picker.Item label="Carnes" value="Carnes" />
            <Picker.Item label="Bebidas" value="Bebidas" />
            <Picker.Item label="Outros" value="Outros" />
          </Picker>
        </View>

        <View style={styles.row}>
          {/* Coluna Preço */}
          <View style={[styles.inputGroup, styles.column]}>
            <Text style={styles.label}>Preço</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefix}>R$</Text>
              <TextInput
                style={[styles.textInput, { paddingLeft: 5 }]}
                value={String(price ? price : "")}
                onChangeText={(val) => setPrice(Number(val))}
                placeholder="0,00"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Coluna Quantidade */}
          <View style={[styles.inputGroup, styles.column]}>
            <Text style={styles.label}>Quantidade</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={String(quantity ? quantity : "")}
                onChangeText={(val) => {
                  setQuantity(Number(val));
                }}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <Text style={styles.label}>Unidade de medida</Text>
        <View style={[styles.pickerWrapper]}>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue, itemIndex) => setUnit(itemValue)}
            style={{ backgroundColor: "white" }}
          >
            {OPCOES_UNIDADE.map((option, index) => (
              <Picker.Item label={option} value={option} key={index} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={[styles.pickerWrapper]}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
            style={{ backgroundColor: "white" }}
          >
            {OPCOES_STATUS.map((option, index) => (
              <Picker.Item label={option} value={option} key={index} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Local armazenado</Text>
        <View style={[styles.pickerWrapper]}>
          <Picker
            selectedValue={location}
            onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
            style={{ backgroundColor: "white" }}
          >
            <Picker.Item label="Geladeira" value="Geladeira" />
            <Picker.Item label="Freezer" value="Freezer" />
            <Picker.Item label="Despensa" value="Despensa" />
          </Picker>
        </View>

        <Text style={styles.label}>Imagem</Text>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
            }}
            onPress={pickImage}
          >
            <Text>Escolher imagem...</Text>
            <FontAwesome name="camera" size={24} color={COLORS.label} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleEditItem}>
          <Text style={styles.addButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.label,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 52,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    color: COLORS.placeholder,
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 15,
  },
  icon: {
    marginHorizontal: 10,
  },
  prefix: {
    fontSize: 16,
    color: COLORS.placeholder,
    marginLeft: 15,
  },

  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 52,
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  column: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 26,
    height: 52,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
