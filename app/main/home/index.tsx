import Card from "@/components/Card";
import FloatingButton from "@/components/FloatingButton";
import FoodListItem from "@/components/FoodListItem";
import SearchBar from "@/components/SearchBar";
import SearchItemsModal, { FoodItem } from "@/components/SearchItemsModal";
import { labelColor, labelTextColor } from "@/constants/status.colors";
import { supabase } from "@/lib/supabase";
import { buttonActionsObject } from "@/types/buttonActionsObject";
import {
    getExpiredItems,
    getExpiringItems,
    getOpenItems,
} from "@/utils/getFoodItemsByGroup";
import {
    Feather,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useFocusEffect, usePathname } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function WelcomeScreen() {
    const path = usePathname();
    const FLOATING_BUTTON_ACTIONS: buttonActionsObject[] = [
        {
            label: "Cadastrar",
            icon: <FontAwesome6 name="keyboard" size={20} color="black" />,
            onPress: () =>
                router.navigate({
                    pathname: "/main/home/forms/newFoodItem",
                    params: { backToPath: path },
                }),
        },
        {
            label: "Escanear",
            icon: <Ionicons name="barcode-sharp" size={24} color="black" />,
            onPress: () => router.push("/main/home/forms/barCodeScanner"),
        },
    ];

    const [leftoversCount, setLeftoversCount] = useState(0);
    const [openedCount, setOpenedCount] = useState(0);
    const [expiringCount, setExpiringCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);

    async function getItemsCount() {
        const { data, error } = await supabase.from("Alimentos").select("*");

        if (error) {
            throw Error(error.message);
        } else {
            const openItems = getOpenItems(data || []);
            setOpenedCount(openItems.length);

            const expiringItems = getExpiringItems(data || []);
            setExpiringCount(expiringItems.length);

            const expiredItems = getExpiredItems(data || []);
            setExpiredCount(expiredItems.length);

            // Leftovers logic to be implemented
        }
    }

    async function fetchLeftOvers() {
        const { data, error } = await supabase
            .from("Refeicoes")
            .select("*")
            .eq("tem_sobras", true);

        if (error) {
            console.error(error);
            setLeftoversCount(0);
        }

        setLeftoversCount(data?.length || 0);
    }

    const fetchItemsFromInventory = async () => {
        const { data, error } = await supabase
            .from("Alimentos")
            .select("*, Ambientes(nome)");

        if (error) throw new Error(error.message);
        const items = data.map((r) => {
            const foodItem = {
                id: r.id,
                nome: r.nome,
                categoria: r.categoria,
                imagem: r.imagem,
                location: r["Ambientes"].nome,
            };

            return foodItem;
        });
        setInventoryItems(items);
    };

    useFocusEffect(
        useCallback(() => {
            getItemsCount();
            fetchLeftOvers();

            return () => {
                // Do something when the screen is unfocused/unmount
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        if (isSearchModalOpen) fetchItemsFromInventory();
        else {
            console.log("desfocando input");
            Keyboard.dismiss();
        }
    }, [isSearchModalOpen, fetchItemsFromInventory]);

    const groupedInventory = inventoryItems.reduce((acc, item) => {
        if (!acc[item.location]) {
            acc[item.location] = [];
        }
        acc[item.location].push(item);
        return acc;
    }, {} as Record<string, FoodItem[]>);

    return (
        <>
            <View style={styles.container}>
                <FloatingButton actions={FLOATING_BUTTON_ACTIONS} />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Section: Sua cozinha */}
                    <Text style={styles.sectionTitle}>Sua cozinha</Text>
                    <View style={styles.grid}>
                        <Card
                            icon={
                                <MaterialCommunityIcons
                                    name="silverware-variant"
                                    size={34}
                                    color={labelTextColor.Sobras}
                                />
                            }
                            label="Sobras"
                            itemsCount={leftoversCount}
                            onPress={() =>
                                router.navigate("/main/home/leftovers")
                            }
                        />
                        <Card
                            icon={
                                <FontAwesome5
                                    name="box-open"
                                    size={30}
                                    color={labelTextColor.Abertos}
                                />
                            }
                            label="Abertos"
                            itemsCount={openedCount}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/main/home/items",
                                    params: { group: "open" },
                                })
                            }
                        />
                        <Card
                            icon={
                                <Feather
                                    name="alert-triangle"
                                    size={30}
                                    color={labelTextColor.Vencendo}
                                />
                            }
                            label="Vencendo"
                            itemsCount={expiringCount}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/main/home/items",
                                    params: { group: "expiring" },
                                })
                            }
                        />
                        <Card
                            icon={
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={34}
                                    color={labelTextColor.Vencidos}
                                />
                            }
                            label="Vencidos"
                            itemsCount={expiredCount}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/main/home/items",
                                    params: { group: "expired" },
                                })
                            }
                        />
                    </View>

                    <SearchBar
                        value=""
                        onChangeText={() => {}}
                        onPress={() => {
                            setIsSearchModalOpen(true);
                        }}
                    />

                    {/* Section: Todos os itens */}
                    <View style={styles.itemsList}>
                        <View style={styles.itemsHeader}>
                            <Text style={styles.sectionTitle}>
                                Todos os itens
                            </Text>
                            <TouchableOpacity
                                style={styles.viewAllBtn}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/main/home/items",
                                        params: { group: "all" },
                                    })
                                }
                            >
                                <Ionicons
                                    name="arrow-forward-sharp"
                                    size={18}
                                    color="#C95CA5"
                                />
                                <Text style={styles.viewAllText}>Ver mais</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <FoodListItem
                                name="Leite Integral"
                                brand="Piracanjuba"
                                category="Laticínios"
                                volume="1 litro"
                                status="Vencendo"
                                statusColor={labelColor.Vencendo}
                                imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
                            />
                            <FoodListItem
                                name="Leite Integral"
                                brand="Piracanjuba"
                                category="Laticínios"
                                volume="1 litro"
                                status="Vencendo"
                                statusColor={labelColor.Vencendo}
                                imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
                            />
                            <FoodListItem
                                name="Leite Integral"
                                brand="Piracanjuba"
                                category="Laticínios"
                                volume="1 litro"
                                status="Vencendo"
                                statusColor={labelColor.Vencendo}
                                imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
                            />
                            <FoodListItem
                                name="Leite Integral"
                                brand="Piracanjuba"
                                category="Laticínios"
                                volume="1 litro"
                                status="Vencendo"
                                statusColor={labelColor.Vencendo}
                                imageUri="https://wallpapers.com/images/hd/fresh-milk-png-tpj9-1g95ko8e01m5304i.jpg"
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <SearchItemsModal
                groupedInventory={groupedInventory}
                onClose={() => setIsSearchModalOpen(false)}
                onItemPress={() => {}}
                isVisible={isSearchModalOpen}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingTop: 20,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 120,
        backgroundColor: "#fff",
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
        marginBottom: 20,
    },

    itemsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 20,
    },
    viewAllBtn: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    viewAllText: {
        color: "#C95CA5",
        fontWeight: "500",
    },
    itemsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    itemBox: {
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    itemsList: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        paddingHorizontal: 16,
        marginTop: 24,
    },
});
