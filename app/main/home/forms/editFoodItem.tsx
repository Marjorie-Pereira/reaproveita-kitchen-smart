import CameraModal from "@/components/CameraModal";
import DatePickerInput from "@/components/DatePicker";
import { supabase } from "@/lib/supabase";
import { foodItem } from "@/types/FoodListItemProps";
import { getLocationById, getLocationId } from "@/utils/locationUtils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { formatDate } from "date-fns";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
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

export default function EditFoodItem() {
    const params = useLocalSearchParams();
    const [name, setName] = useState<string>();
    const [brand, setBrand] = useState<string>();
    const [expirationDate, setExpirationDate] = useState<string>();
    const [itemData, setItemData] = useState<foodItem>();
    const [location, setLocation] = useState<string>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState<string>();
    const [price, setPrice] = useState<string>();
    const [quantity, setQuantity] = useState<string>();
    const [unit, setUnit] = useState<string>();
    const [imageUri, setImageUri] = useState<string>();
    const [status, setStatus] = useState<string>();

 

    async function fetchItemData() {
        if (!params.itemId) return;

        // Use .single() se você espera apenas um registro
        const { data, error } = await supabase
            .from("Alimentos")
            .select("*")
            .eq("id", params.itemId)
            .single(); // Adicione .single() para tipagem e resultado mais limpos

        if (error) throw new Error(error.message);

        // ✅ Proteção 1: Verifica se o dado foi encontrado
        if (!data) {
            console.warn(`Item com ID ${params.itemId} não encontrado.`);
            // Limpar ou definir estados de erro aqui é uma boa prática
            setItemData(undefined);
            setLocation(undefined);
            return;
        }

        // Se encontrou, data é o objeto, não um array (graças ao .single())
        const locationName = await getLocationById(data.id_ambiente);
        setLocation(locationName);

        setItemData(data as foodItem);
    }

    useEffect(() => {
        setName(itemData?.nome);
        setBrand(itemData?.marca);
        setStatus(itemData?.status);
        setExpirationDate(itemData?.data_validade);
        setCategory(itemData?.categoria);
        setUnit(itemData?.unidade_medida);
        setImageUri(itemData?.imagem);
        setPrice(itemData?.preco?.toString());
        setQuantity(itemData?.quantidade?.toString());
    }, [itemData]);

    useFocusEffect(
        useCallback(() => {
            fetchItemData();
        }, [])
    );

    async function handleEditItem() {
        if (!location) {
            Alert.alert(
                "Aviso",
                "Aguarde o carregamento dos dados ou selecione uma localização."
            );
            return;
        }

        // const formattedExpirationDate = formatDate(expirationDate ?? new Date(), 'yyy-MM-dd')

        const { id } = await getLocationId(location);
        const { data, error } = await supabase
            .from("Alimentos")
            .update({
                nome: name,
                marca: brand,
                data_validade: expirationDate,
                categoria: category,
                preco: price ? parseFloat(price) : null,
                quantidade: quantity ? parseInt(quantity, 10) : null,
                unidade_medida: unit,
                status,
                id_ambiente: id,
                imagem: imageUri,
            })
            .eq("id", params.itemId);

        if (error) {
            console.error(error);
            
        } else {
            Alert.alert("Alimento Editado!");
            setName("");
            setBrand("");
            setExpirationDate(undefined);
            setPrice("");
            setQuantity("");
            setCategory("Grãos");

            router.back();
        }
    }

    const renderPicture = (uri: string) => {
        return (
            <View>
                <Image
                    source={{ uri }}
                    contentFit="contain"
                    style={{ width: 300, aspectRatio: 1 }}
                />
            </View>
        );
    };

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
                            value={name ?? ""}
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
                            value={brand ?? ""}
                            onChangeText={setBrand}
                            placeholder="Ex: Heinz"
                        />
                    </View>
                </View>

                <DatePickerInput
                    label="Data de validade"
                    value={expirationDate}
                    onChange={(date) => {
                        const formatted = formatDate(date, 'yyy-MM-dd')
                        setExpirationDate(formatted)
                    }}
                />

                <Text style={styles.label}>Categoria</Text>
                <View style={[styles.pickerWrapper]}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue, itemIndex) =>
                            setCategory(itemValue)
                        }
                        style={{ backgroundColor: "white", color: "black" }}
                    >
                        <Picker.Item label="Grãos" value="Grãos" />
                        <Picker.Item label="Frutas" value="Frutas" />
                        <Picker.Item label="Vegetais" value="Vegetais" />
                        <Picker.Item label="Laticínios" value="Laticínios" />
                        <Picker.Item label="Carnes" value="Carnes" />
                        <Picker.Item label="Bebidas" value="Bebidas" />
                        <Picker.Item label="Outros" value="Outros" />
                    </Picker>
                    {/* opção para digitar a categoria */}
                </View>

                <View style={styles.row}>
                    {/* Coluna Preço */}
                    <View style={[styles.inputGroup, styles.column]}>
                        <Text style={styles.label}>Preço</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.prefix}>R$</Text>
                            <TextInput
                                style={[styles.textInput, { paddingLeft: 5 }]}
                                value={price}
                                onChangeText={setPrice}
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
                                value={quantity}
                                onChangeText={setQuantity}
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
                        onValueChange={(itemValue, itemIndex) =>
                            setUnit(itemValue)
                        }
                        style={{ backgroundColor: "white", color: "black" }}
                    >
                        {OPCOES_UNIDADE.map((option, index) => (
                            <Picker.Item
                                label={option}
                                value={option}
                                key={index}
                            />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Status</Text>
                <View style={[styles.pickerWrapper]}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) =>
                            setStatus(itemValue)
                        }
                        style={{ backgroundColor: "white", color: "black" }}
                    >
                        {OPCOES_STATUS.map((option, index) => (
                            <Picker.Item
                                label={option}
                                value={option}
                                key={index}
                            />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Local armazenado</Text>
                <View style={[styles.pickerWrapper]}>
                    <Picker
                        selectedValue={location}
                        onValueChange={(itemValue, itemIndex) =>
                            setLocation(itemValue)
                        }
                        style={{ backgroundColor: "white", color: "black" }}
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
                        onPress={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <Text>Escolher imagem...</Text>
                        <FontAwesome
                            name="camera"
                            size={24}
                            color={COLORS.label}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    {imageUri && renderPicture(imageUri as string)}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleEditItem}
                >
                    <Text style={styles.addButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
            <CameraModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={setImageUri}
            />
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
