import { COLORS, globalStyles } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import filter from "lodash.filter";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Button from "./Button";
import Loading from "./Loading";
import SearchBar from "./SearchBar";

// 2. PROCESSAMENTO (AGRUPAMENTO) DOS DADOS
type RawFoodItem = {
    id: string;
    nome: string;
    imagem: string;
    categoria: string;
    Ambientes: {
        nome: string;
    }[];
};

type FoodItem = Omit<RawFoodItem, "Ambientes"> & {
    location: string;
};

interface SearchItemsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onItemPress: (id: string) => void;
    searchBarPlaceholder?: string;
}

type InventoryGroup = [string, FoodItem[]];

const SearchItemsModal: React.FC<SearchItemsModalProps> = ({
    isVisible,
    onClose,
    onItemPress,
    searchBarPlaceholder,
}) => {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<[string, FoodItem[]][]>([]);
    const [initialItems, setInitialItems] = useState<[string, FoodItem[]][]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const groupInventoryByLocation = (
        data: any[]
    ): Record<string, FoodItem[]> => {
        if (!data || data.length === 0) {
            console.log("nao tem dados");
            return {};
        }

        const groupedMap: Record<string, FoodItem[]> = data.reduce(
            (acc, rawItem) => {
                const { nome: locationName } = rawItem["Ambientes"];

                if (!locationName) {
                    return acc;
                }

                if (!acc[locationName]) {
                    acc[locationName] = [];
                }

                const { Ambientes, ...itemWithoutAmbientes } = rawItem;

                const itemForLocation: FoodItem = {
                    ...itemWithoutAmbientes,
                    location: locationName,
                };

                acc[locationName].push(itemForLocation);

                return acc;
            },
            {} as Record<string, FoodItem[]>
        );

        return groupedMap;
    };

    const fetchAndProcessInventory = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("Alimentos")
                .select("id, nome, categoria, imagem, Ambientes(nome)")
                .eq("id_usuario", user?.id);

            if (error) throw error;

            console.log(data.length);

            const groupedInventoryEntries = Object.entries(
                groupInventoryByLocation(data)
            );

            console.log(groupedInventoryEntries);

            // Armazena a fonte de dados completa
            setInitialItems(groupedInventoryEntries);
            // Atualiza a lista exibida (items)
            setItems(groupedInventoryEntries);
        } catch (error) {
            console.error("Erro ao buscar inventário:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && items.length === 0) {
            fetchAndProcessInventory();
        }

        if (!isVisible) {
            setSearch("");
            setItems([]);
        }
    }, [isVisible]);

    const handleSearch = (query: string) => {
        setSearch(query);

        if (query.length === 0) {
            setItems(initialItems);
            return;
        }
        const formattedQuery = query.toLowerCase().trim();

        const mappedAndFilteredData = (items as InventoryGroup[])
            .map(([location, foodItems]) => {
                const matchingFoodItems = filter(foodItems, (item) => {
                    if (!item || typeof item.nome !== "string") {
                        return false;
                    }
                    return item.nome.toLowerCase().includes(formattedQuery);
                });

                return [location, matchingFoodItems] as InventoryGroup;
            })

            .filter(([, foodItems]) => foodItems.length > 0);

        setItems(mappedAndFilteredData);
    };

    return (
        <Modal
            visible={isVisible}
            onBlur={onClose}
            onDismiss={onClose}
            allowSwipeDismissal={true}
            style={modalStyles.modal}
            animationType="slide"
        >
            <View style={[globalStyles.modalView, { paddingTop: 60 }]}>
                {/* Modal Header */}
                <View style={globalStyles.modalHeader}>
                    <View style={modalStyles.headerContent}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={modalStyles.closeButton}
                        >
                            <Feather
                                name="x"
                                size={20}
                                color={COLORS.slate400}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modal Content */}
                <ScrollView style={modalStyles.content}>
                    <View style={{ marginBottom: 25 }}>
                        <Text
                            style={{
                                fontSize: 23,
                                marginBottom: 20,
                                fontWeight: "500",
                            }}
                        >
                            Buscar itens do inventário
                        </Text>
                        <SearchBar
                            value={search}
                            placeholder={searchBarPlaceholder}
                            onChangeText={handleSearch}
                        />
                    </View>

                    {/* LISTA DE ITENS */}
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <View style={{ gap: 20, marginBottom: 40 }}>
                            {items.map(([location, items]) => (
                                <View key={location}>
                                    <Text style={modalStyles.locationTitle}>
                                        {location}
                                    </Text>
                                    <View style={{ gap: 8 }}>
                                        {items.map((item) => {
                                            return (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    onPress={() =>
                                                        onItemPress(item.id)
                                                    }
                                                    style={modalStyles.foodItem}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "flex-start",
                                                        }}
                                                    >
                                                        <Image
                                                            source={item.imagem}
                                                            contentFit="cover"
                                                            style={{
                                                                width: 80,
                                                                height: 80,
                                                            }}
                                                        />
                                                        <View
                                                            style={{
                                                                marginLeft: 10,
                                                            }}
                                                        >
                                                            <Text
                                                                style={
                                                                    modalStyles.itemName
                                                                }
                                                            >
                                                                {item.nome}
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    modalStyles.itemCategory
                                                                }
                                                            >
                                                                {item.categoria}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>

                {/* Modal Footer */}
                <View style={globalStyles.modalFooter}>
                    <Button
                        onPress={onClose}
                        buttonStyle={[globalStyles.outlineButton, { flex: 1 }]}
                        textStyle={globalStyles.outlineButtonText}
                    >
                        <Text>Cancelar</Text>
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },

    closeButton: {
        marginLeft: 8,
        padding: 4,
        borderRadius: 8,
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    locationTitle: {
        fontSize: 16,
        color: COLORS.slate900,
        fontWeight: "600",
        marginBottom: 8,
    },
    foodItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        backgroundColor: COLORS.white,
    },

    itemName: {
        color: COLORS.slate900,
        fontSize: 16,
        fontWeight: "500",
    },
    itemCategory: {
        fontSize: 14,
        color: COLORS.slate500,
        marginTop: 2,
    },
});

export default SearchItemsModal;
