import FloatingButton from "@/components/FloatingButton";
import FoodCard from "@/components/FoodCard";
import ItemForm from "@/components/ItemForm";
import LocationButtonGroup from "@/components/LocationButtonGroup";
import ScannerModal from "@/components/ScannerModal";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import { foodItem } from "@/types/FoodListItemProps";
import { productType } from "@/types/openFoodApiResponse";
import { getLocationId } from "@/utils/locationUtils";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
    router,
    Stack,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
const groupMap = {
    leftovers: "Sobras",
    expiring: "Itens Vencendo",
    expired: "Itens Vencidos",
    open: "Itens Abertos",
    all: "Todos os itens",
};

import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { subDays } from "date-fns";
import filter from "lodash.filter";

const Inventory = () => {
    const { user } = useAuth();
    const { group, scanning, addingItem } = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<string>("Geladeira");
    const [foodList, setFoodList] = useState<foodItem[]>([]);
    const [queryFoodList, setQueryFoodList] = useState<foodItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(addingItem ? true : false);
    const [isScannerOpen, setIsScannerOpen] = useState<boolean>(
        scanning ? true : false
    );
    const [refreshKey, setRefreshKey] = useState(0);
    const [scannedItem, setScannedItem] = useState<productType | undefined>(
        undefined
    );

    const [search, setSearch] = useState("");
    const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
        {
            label: "Cadastrar",
            icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
            onPress: () => setIsModalOpen(true),
        },
        {
            label: "Escanear",
            icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
            onPress: () => setIsScannerOpen(true),
        },
    ];
    const getExpiredItems = (items: foodItem[], id: string) => {
        return items.filter((item) => {
            const expirationDate = new Date(item.data_validade);
            const expDateLocal = subDays(expirationDate, 1);

            return (
                expDateLocal.getTime() < new Date().getTime() &&
                item.id_ambiente === id
            );
        });
    };

    const getExpiringItems = (items: foodItem[], id: string) => {
        return items.filter((item) => {
            const expirationDate = new Date(item.data_validade);
            const notExpired = expirationDate.getDate() >= new Date().getDate();

            return (
                notExpired &&
                expirationDate.getDate() - new Date().getDate() <= 7 &&
                item.id_ambiente === id
            );
        });
    };

    const getOpenItems = (items: foodItem[], id: string) => {
        return [
            ...items.filter(
                (item) => item.status === "Aberto" && item.id_ambiente === id
            ),
        ];
    };

    async function handleAddItem(item: foodItem) {
        const { error } = await supabase.from("Alimentos").insert({
            ...item,
            id_usuario: user.id,
        });

        if (error) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
        } else {
            Alert.alert("Alimento Adicionado");
            setIsModalOpen(false);
            setRefreshKey((prev) => prev + 1);
        }
    }

    async function fetchItemsFromLocation(
        field: string = "",
        value: string = ""
    ) {
        const { id } = await getLocationId(location ?? "Geladeira");
        const { data, error } = await supabase
            .from("Alimentos")
            .select("*")
            .eq("id_ambiente", id)
            .eq(field, value)
            .eq("id_usuario", user.id);

        if (error) {
            throw Error(error.message);
        }

        return data;
    }

    function getFilteredByGroup(group: string, items: foodItem[], id: string) {
        switch (group) {
            case "open":
                return getOpenItems(items, id);

            case "expiring":
                return getExpiringItems(items, id);

            case "expired":
                return getExpiredItems(items, id);

            default:
                return items;
        }
    }

    const handleScanned = (scannedItem: productType) => {
        setScannedItem(scannedItem);
        setIsScannerOpen(false);
        setIsModalOpen(true);
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        const formattedQuery = query.toLowerCase();

        const filteredData = filter(queryFoodList, (foodItem: foodItem) => {
            return foodItem.nome.toLowerCase().includes(formattedQuery);
        });

        setFoodList(filteredData);
    };

    const loadData = useCallback(async () => {
        console.log("carregando dados no callback");
        setIsLoading(true);

        try {
            const { id } = await getLocationId(location ?? "Geladeira");

            let items = await fetchItemsFromLocation("id_ambiente", id);

            if (group && group !== "all") {
                items = getFilteredByGroup(group as string, items, id) || [];
            }

            setFoodList(items);
            setQueryFoodList(items);
        } catch (err) {
            console.error("Erro no carregamento da tela:", err);
        }
    }, [group, location, refreshKey]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            loadData().finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

            return () => {
                isActive = false;
            };
        }, [loadData])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: groupMap[group as keyof typeof groupMap],
                }}
            />
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingTop: 20,
                    gap: 20,
                }}
            >
                <SearchBar
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Pesquisar itens..."
                />
                <LocationButtonGroup
                    onSelect={(val) => setLocation(val)}
                    activeBtn={location}
                />
                <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
                <ScrollView>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <View style={styles.foodItemsGrid}>
                            {foodList.map((item: foodItem) => {
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={{ width: "48%" }}
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/main/home/items/itemView",
                                                params: { itemId: item.id },
                                            })
                                        }
                                    >
                                        <FoodCard
                                            image={item.imagem}
                                            title={item.nome}
                                            brand={item.marca}
                                            quantity={item.quantidade}
                                            measureUnit={item.unidade_medida}
                                            expirationDate={item.data_validade}
                                            category={item.categoria}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            </View>
            <Modal
                visible={isModalOpen}
                onBlur={() => setIsModalOpen(false)}
                onDismiss={() => setIsModalOpen(false)}
                allowSwipeDismissal={true}
                style={styles.modal}
                animationType="slide"
            >
                <ItemForm
                    variant="new"
                    onSubmit={handleAddItem}
                    onCancel={() => setIsModalOpen(false)}
                    scanned={scannedItem}
                />
            </Modal>
            <ScannerModal
                isVisible={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScanned}
            />
        </>
    );
};

const styles = StyleSheet.create({
    foodItemsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
});

export default Inventory;
