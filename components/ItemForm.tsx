import DatePickerInput from "@/components/DatePicker";
import { COLORS } from "@/constants/theme";
import { foodItem, foodStatus } from "@/types/FoodListItemProps";
import { productType } from "@/types/openFoodApiResponse";
import { getLocationById, getLocationId } from "@/utils/locationUtils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CameraModal from "./CameraModal";

interface ItemFormProps {
    productData?: foodItem;
    scanned?: productType;
    variant: "edit" | "new";
    onSubmit: (itemData: foodItem) => void;
    onCancel: () => void;
}
export default function ItemForm(props: ItemFormProps) {
    const { productData, scanned, variant, onSubmit, onCancel } = props;

    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [expirationDate, setExpirationDate] = useState<string>();
    const [category, setCategory] = useState("Grãos");
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);

    // user input states
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState<number | undefined>(undefined);
    const [unit, setUnit] = useState<string>("Selecione");
    const [status, setStatus] = useState("Fechado");
    const [location, setLocation] = useState("Geladeira");
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    useEffect(() => {
        if (variant === "edit" && productData) {
            setName(productData?.nome ?? "");
            setBrand(productData?.marca ?? "");
            setExpirationDate(productData?.data_validade!);
            setCategory(productData?.categoria!);
            setImageUri(productData?.imagem);
            setPrice(productData.preco);
            setQuantity(productData.quantidade);
            setUnit(productData.unidade_medida);
            setStatus(productData.status);

            getLocationById(productData.id_ambiente).then((data) =>
                setLocation(data)
            );
        } else if (scanned) {
            setName(scanned.product_name);
            setBrand(scanned.brands);
            setExpirationDate(scanned.expiration_date);
            setCategory(scanned.categories);
            setImageUri(scanned.image_url);
        }
    }, [variant, scanned]);

    function resetForm() {
        setName("");
        setBrand("");
        setExpirationDate(undefined);
        setCategory("");
        setPrice(undefined);
        setQuantity(undefined);
        setUnit("Selecione");
        setStatus("Fechado");
        setLocation("Geladeira");
        setImageUri(undefined);
        
    }

    async function submitForm() {
        const { id } = await getLocationId(location);
        const itemData: foodItem = {
            nome: name,
            marca: brand,
            categoria: category,
            id_ambiente: id,
            data_validade: expirationDate ?? new Date().toLocaleString(),
            imagem: imageUri!,
            preco: price!,
            quantidade: quantity!,
            status: status as foodStatus,
            unidade_medida: unit,
        };

        const { imagem, ...rest } = itemData;

        const notComplete = Object.values(rest).some((val) => val == undefined);
        if (notComplete) {
            Alert.alert("Por favor preencha todos os campos");
            return;
        }
        
        onSubmit(itemData);
        resetForm();
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
                            value={name as string}
                            onChangeText={setName}
                            placeholder="Ex: Tomate"
                            placeholderTextColor={COLORS.placeholder}
                        />
                        {name?.length > 0 && (
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
                            value={brand as string}
                            onChangeText={setBrand}
                            placeholder="Ex: Heinz"
                            placeholderTextColor={COLORS.placeholder}
                        />
                    </View>
                </View>

                <DatePickerInput
                    label="Data de validade"
                    value={expirationDate}
                    onChange={(newDate: Date) =>
                        setExpirationDate(newDate.toISOString())
                    }
                />

                <Text style={styles.label}>Categoria</Text>
                <View style={[styles.inputWrapper]}>
                    <TextInput
                        style={[styles.textInput, { paddingLeft: 5 }]}
                        value={category}
                        onChangeText={setCategory}
                        placeholder="Bebidas, Grãos, Massas etc..."
                        placeholderTextColor={COLORS.placeholder}
                    />
                </View>

                <View style={styles.row}>
                    {/* Coluna Preço */}
                    <View style={[styles.inputGroup, styles.column]}>
                        <Text style={styles.label}>Preço</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.prefix}>R$</Text>
                            <TextInput
                                style={[styles.textInput, { paddingLeft: 5 }]}
                                value={price?.toString()}
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
                                value={quantity?.toString()}
                                onChangeText={(val) => setQuantity(Number(val))}
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
                        style={{ backgroundColor: "white", color: COLORS.text }}
                        dropdownIconColor={COLORS.text}
                        mode="dropdown"
                    >
                        <Picker.Item label={unit} value={unit} />
                        <Picker.Item
                            label={"Unidade(s)"}
                            value={"Unidade(s)"}
                        />
                        <Picker.Item label={"ml"} value={"ml"} />
                        <Picker.Item label={"kg"} value={"kg"} />
                        <Picker.Item label={"g"} value={"g"} />
                        <Picker.Item label={"litro(s)"} value={"litro(s)"} />
                    </Picker>
                </View>

                <Text style={styles.label}>Status</Text>
                <View style={[styles.pickerWrapper]}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) =>
                            setStatus(itemValue)
                        }
                        style={{ backgroundColor: "white", color: COLORS.text }}
                        dropdownIconColor={COLORS.text}
                        mode="dropdown"
                    >
                        <Picker.Item label="Aberto" value="Aberto" />
                        <Picker.Item label="Fechado" value="Fechado" />
                    </Picker>
                </View>

                <Text style={styles.label}>Local armazenado</Text>
                <View style={[styles.pickerWrapper]}>
                    <Picker
                        selectedValue={location}
                        onValueChange={(itemValue, itemIndex) =>
                            setLocation(itemValue)
                        }
                        style={{ backgroundColor: "white", color: COLORS.text }}
                        dropdownIconColor={COLORS.text}
                        mode="dropdown"
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
                            setIsCameraOpen(true);
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
                    onPress={() => submitForm()}
                >
                    <Ionicons name="add" size={24} color={COLORS.white} />
                    <Text style={styles.addButtonText}>
                        {variant === "edit" ? "Confirmar" : "Adicionar"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.addButton, styles.cancelButton]}
                    onPress={() => {
                        resetForm();
                        onCancel();
                    }}
                >
                    <Ionicons name="close" size={24} color={COLORS.primary} />
                    <Text
                        style={[
                            styles.addButtonText,
                            { color: COLORS.primary },
                        ]}
                    >
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </View>

            <CameraModal
                isVisible={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onSubmit={setImageUri}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 70,
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
        paddingBottom: 40,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        flexDirection: "row",
        gap: 10,
        width: "100%",
        justifyContent: "center",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        borderRadius: 26,
        height: 52,
        paddingHorizontal: 25,
    },
    cancelButton: {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: COLORS.primary,
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
