// import DatePickerInput from "@/components/DatePicker";
// import { COLORS } from "@/constants/theme";
// import { supabase } from "@/lib/supabase";
// import { productType } from "@/types/openFoodApiResponse";
// import { toISOFormatString } from "@/utils/dateFormat";
// import { getLocationId } from "@/utils/locationUtils";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import { Image } from "expo-image";
// import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
// import React, { useCallback, useState } from "react";
// import {
//     Alert,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const OPCOES_UNIDADE = ["Kg", "g", "L", "ml", "Unidade(s)"];

// export default function AddFoodScreen() {
//     const params = useLocalSearchParams();
//     const router = useRouter();
//     let scannedProduct: productType | undefined;

//     if (params?.scannedProduct)
//         scannedProduct = JSON.parse(params?.scannedProduct as string);

//     const initialValues = {
//         name: scannedProduct?.product_name ?? params.name,
//         brand: scannedProduct?.brands ?? params.brand,
//         expirationDate:
//             toISOFormatString(scannedProduct?.expiration_date as string)
//                 .length > 0
//                 ? toISOFormatString(scannedProduct?.expiration_date as string)
//                 : params.expirationDate,
//         category: scannedProduct?.categories ?? params.category,
//     };
//     const [name, setName] = useState(initialValues.name);
//     const [brand, setBrand] = useState(initialValues.brand);
//     const [expirationDate, setExpirationDate] = useState<null | Date>(
//         initialValues
//     );
//     const [category, setCategory] = useState(initialValues.category ?? "Grãos");
//     const imageUri = scannedProduct?.image_url ?? params.uri;

//     // user input states
//     const [price, setPrice] = useState(params.price ?? 0);
//     const [quantity, setQuantity] = useState(params.quantity ?? 0);
//     const [unit, setUnit] = useState(params.unit ?? OPCOES_UNIDADE[0]);
//     const [status, setStatus] = useState(params.status ?? "Fechado");
//     const [location, setLocation] = useState(params.location ?? "Geladeira");

//     const itemParams = {
//         name,
//         brand,
//         expirationDate: expirationDate?.toUTCString(),
//         category,
//         price,
//         quantity,
//         unit,
//         status,
//         location,
//     };

//     useFocusEffect(
//         useCallback(() => {
//             console.log("params de new food", params);
//             return () => {};
//         }, [])
//     );

//     function resetForm() {
//         setName("");
//         setBrand("");
//         setExpirationDate(null);
//         setCategory("Grãos");
//         setPrice("");
//         setQuantity("");
//         setUnit(OPCOES_UNIDADE[0]);
//         setStatus("Fechado");
//         setLocation("Geladeira");
//     }

//     async function handleAddItem() {
//         const { id } = await getLocationId(location as string);
//         const { error } = await supabase.from("Alimentos").insert({
//             nome: name,
//             marca: brand,
//             data_validade: expirationDate,
//             categoria: category,
//             preco: price,
//             quantidade: quantity,
//             unidade_medida: unit,
//             status,
//             id_ambiente: id,
//             imagem: imageUri,
//         });

//         if (error) {
//             Alert.alert("Erro", "Por favor, preencha todos os campos");
//         } else {
//             Alert.alert("Alimento Adicionado");
//             resetForm();
//             //   router.replace({
//             //     pathname: params.backToPath as RelativePathString,
//             //     params: params.group ? { group: params.group } : {},
//             //   });
//             router.back();
//         }
//     }

//     const renderPicture = (uri: string) => {
//         return (
//             <View>
//                 <Image
//                     source={{ uri }}
//                     contentFit="contain"
//                     style={{ width: 300, aspectRatio: 1 }}
//                 />
//             </View>
//         );
//     };

//     return (
//         <>
//             <ScrollView
//                 style={styles.container}
//                 contentContainerStyle={styles.scrollContainer}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <View style={styles.inputGroup}>
//                     <Text style={styles.label}>Nome</Text>
//                     <View style={styles.inputWrapper}>
//                         <TextInput
//                             style={styles.textInput}
//                             value={name as string}
//                             onChangeText={setName}
//                             placeholder="Ex: Tomate"
//                             placeholderTextColor={COLORS.placeholder}
                           
//                         />
//                         {name?.length > 0 && (
//                             <TouchableOpacity onPress={() => setName("")}>
//                                 <Ionicons
//                                     name="close-circle"
//                                     size={22}
//                                     color={COLORS.placeholder}
//                                     style={styles.icon}
//                                 />
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>

//                 <View style={styles.inputGroup}>
//                     <Text style={styles.label}>Marca</Text>
//                     <View style={styles.inputWrapper}>
//                         <TextInput
//                             style={styles.textInput}
//                             value={brand as string}
//                             onChangeText={setBrand}
//                             placeholder="Ex: Heinz"
//                             placeholderTextColor={COLORS.placeholder}
//                         />
//                     </View>
//                 </View>

//                 <DatePickerInput
//                     label="Data de validade"
//                     value={
//                         expirationDate ? new Date(expirationDate) : new Date()

//                     }
//                     onChange={(newDate: Date) => setExpirationDate(newDate)}
//                 />

//                 <Text style={styles.label}>Categoria</Text>
//                 <View style={[styles.pickerWrapper]}>
//                     <Picker
//                         selectedValue={category}
//                         onValueChange={(itemValue, itemIndex) =>
//                             setCategory(itemValue)
//                         }
//                         style={{ backgroundColor: "white", color: "black" }}
//                     >
//                         {/* TODO - Implementar Array.map */}
//                         <Picker.Item label="Grãos" value="Grãos" />
//                         <Picker.Item label="Frutas" value="Frutas" />
//                         <Picker.Item label="Vegetais" value="Vegetais" />
//                         <Picker.Item label="Laticínios" value="Laticínios" />
//                         <Picker.Item label="Carnes" value="Carnes" />
//                         <Picker.Item label="Bebidas" value="Bebidas" />
//                         <Picker.Item label="Outros" value="Outros" />
//                     </Picker>
//                 </View>

//                 <View style={styles.row}>
//                     {/* Coluna Preço */}
//                     <View style={[styles.inputGroup, styles.column]}>
//                         <Text style={styles.label}>Preço</Text>
//                         <View style={styles.inputWrapper}>
//                             <Text style={styles.prefix}>R$</Text>
//                             <TextInput
//                                 style={[styles.textInput, { paddingLeft: 5 }]}
//                                 value={price as string}
//                                 onChangeText={setPrice}
//                                 placeholder="0,00"
//                                 keyboardType="numeric"
//                             />
//                         </View>
//                     </View>

//                     {/* Coluna Quantidade */}
//                     <View style={[styles.inputGroup, styles.column]}>
//                         <Text style={styles.label}>Quantidade</Text>
//                         <View style={styles.inputWrapper}>
//                             <TextInput
//                                 style={styles.textInput}
//                                 value={quantity as string}
//                                 onChangeText={setQuantity}
//                                 placeholder="1"
//                                 keyboardType="numeric"
//                             />
//                         </View>
//                     </View>
//                 </View>

//                 <Text style={styles.label}>Unidade de medida</Text>
//                 <View style={[styles.pickerWrapper]}>
//                     <Picker
//                         selectedValue={unit}
//                         onValueChange={(itemValue, itemIndex) =>
//                             setUnit(itemValue)
//                         }
//                         style={{ backgroundColor: "white", color: "black" }}
//                     >
//                         {OPCOES_UNIDADE.map((option, index) => (
//                             <Picker.Item
//                                 label={option}
//                                 value={option}
//                                 key={index}
//                             />
//                         ))}
//                     </Picker>
//                 </View>

//                 <Text style={styles.label}>Status</Text>
//                 <View style={[styles.pickerWrapper]}>
//                     <Picker
//                         selectedValue={status}
//                         onValueChange={(itemValue, itemIndex) =>
//                             setStatus(itemValue)
//                         }
//                         style={{ backgroundColor: "white", color: "black" }}
//                     >
//                         <Picker.Item label="Aberto" value="Aberto" />
//                         <Picker.Item label="Fechado" value="Fechado" />
//                     </Picker>
//                 </View>

//                 <Text style={styles.label}>Local armazenado</Text>
//                 <View style={[styles.pickerWrapper]}>
//                     <Picker
//                         selectedValue={location}
//                         onValueChange={(itemValue, itemIndex) =>
//                             setLocation(itemValue)
//                         }
//                         style={{ backgroundColor: "white", color: "black" }}
//                     >
//                         <Picker.Item label="Geladeira" value="Geladeira" />
//                         <Picker.Item label="Freezer" value="Freezer" />
//                         <Picker.Item label="Despensa" value="Despensa" />
//                     </Picker>
//                 </View>

//                 <Text style={styles.label}>Imagem</Text>
//                 <View style={styles.inputWrapper}>
//                     <TouchableOpacity
//                         style={{
//                             flexDirection: "row",
//                             width: "100%",
//                             justifyContent: "space-between",
//                             padding: 10,
//                         }}
//                         onPress={() => {
//                             router.push({
//                                 pathname: "/cameraTest",
//                                 params: {
//                                     ...itemParams,
//                                     path: "/main/home/forms/newFoodItem",
//                                 },
//                             });
//                         }}
//                     >
//                         <Text>Escolher imagem...</Text>
//                         <FontAwesome
//                             name="camera"
//                             size={24}
//                             color={COLORS.label}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.imageContainer}>
//                     {imageUri && renderPicture(imageUri as string)}
//                 </View>
//             </ScrollView>

//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={handleAddItem}
//                 >
//                     <Ionicons name="add" size={24} color={COLORS.white} />
//                     <Text style={styles.addButtonText}>Adicionar</Text>
//                 </TouchableOpacity>
//             </View>
//         </>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//     },
//     scrollContainer: {
//         padding: 20,
//         paddingBottom: 100,
//     },
//     inputGroup: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 14,
//         color: COLORS.label,
//         marginBottom: 8,
//         fontWeight: "500",
//     },
//     inputWrapper: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: COLORS.white,
//         borderWidth: 1.5,
//         borderColor: COLORS.border,
//         borderRadius: 10,
//         height: 52,
//     },
//     textInput: {
//         flex: 1,
//         paddingHorizontal: 15,
//         fontSize: 16,
//         color: COLORS.text,
//     },
//     placeholderText: {
//         color: COLORS.placeholder,
//         fontSize: 16,
//         flex: 1,
//         paddingHorizontal: 15,
//     },
//     icon: {
//         marginHorizontal: 10,
//     },
//     prefix: {
//         fontSize: 16,
//         color: COLORS.placeholder,
//         marginLeft: 15,
//     },

//     pickerWrapper: {
//         borderWidth: 1.5,
//         borderColor: COLORS.border,
//         borderRadius: 10,
//         height: 52,
//         justifyContent: "center",
//         overflow: "hidden",
//         marginBottom: 20,
//     },
//     pickerText: {
//         fontSize: 16,
//         color: COLORS.text,
//     },

//     row: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         gap: 15,
//     },
//     column: {
//         flex: 1,
//     },
//     buttonContainer: {
//         padding: 20,
//         backgroundColor: COLORS.background,
//         borderTopWidth: 1,
//         borderTopColor: "#e0e0e0",
//     },
//     addButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: COLORS.primary,
//         borderRadius: 26,
//         height: 52,
//     },
//     addButtonText: {
//         color: COLORS.white,
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 10,
//     },
//     imageContainer: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     image: {
//         width: 200,
//         height: 200,
//     },
// });
