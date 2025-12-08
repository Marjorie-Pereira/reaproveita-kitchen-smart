import Loading from "@/components/Loading";
import { fallbackImg } from "@/constants/fallbackImage";
import { COLORS } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { foodItem } from "@/types/FoodListItemProps";
import { capitalizeFirstLetter } from "@/utils/capitalizeString";
import { formatExpirationDate } from "@/utils/dateFormat";
import { getLocationById } from "@/utils/locationUtils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const badgeColor = {
    Vencendo: "#FEF9C2",
    Vencido: "#FFE3E2",
};

const badgeTextColor = {
    Vencendo: "#B7950B",
    Vencido: "#9E2B35",
};

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

const FoodItemView = () => {
    const { itemId } = useLocalSearchParams<{ itemId: string }>();
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [itemData, setItemData] = useState<foodItem | undefined>();
    const [statusBadge, setStatusBadge] = useState<string>();
    const [bannerMessage, setBannerMessage] = useState<string>();
    const router = useRouter();

    function handleEdit() {
        router.push({
            pathname: "/main/home/forms/editFoodItem",
            params: { itemId: itemId },
        });
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
                        const { error } = await supabase
                            .from("Alimentos")
                            .delete()
                            .eq("id", itemId);

                        if (error) {
                            console.error(error);
                        } else {
                            Alert.alert("Deletado com sucesso!");
                            router.back();
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

    async function fetchItemData(isActive: { value: boolean }) {
        setIsLoading(true);

        if (!itemId) {
            if (isActive.value) {
                // Verifica se ainda está ativa
                setItemData(undefined);
                setIsLoading(false);
            }
            return;
        }

        try {
            const { data, error } = await supabase
                .from("Alimentos")
                .select("*")
                .eq("id", itemId)
                .single();

            if (error || !data) {
                throw new Error(error?.message || "Item não encontrado.");
            }

            if (isActive.value) {
                const locationName = await getLocationById(data.id_ambiente);

                const item = data as foodItem;
                setLocation(locationName);
                setItemData(item);
                setStatusLabel(item);
            }
        } catch (err) {
            console.error("Erro ao carregar dados do item:", err);

            if (isActive.value) {
                setItemData(undefined);
                Alert.alert("Erro", "Não foi possível carregar o item.");
            }
        } finally {
            if (isActive.value) {
                setIsLoading(false);
            }
        }
    }

    const setStatusLabel = (itemData: foodItem) => {
        if (!itemData || !itemData.data_validade) {
            setStatusBadge(undefined);
            setBannerMessage(undefined);
            return;
        }

        const expiringThresholdDays = 7;

        const diffDays = differenceInCalendarDays(
            parseISO(itemData.data_validade),
            new Date()
        );

        if (diffDays < 0) {
            setStatusBadge("Vencido");
            setBannerMessage(`Vencido há ${Math.abs(diffDays)} dias`);
        } else if (diffDays >= 0 && diffDays <= expiringThresholdDays) {
            setStatusBadge("Vencendo");
            setBannerMessage(
                diffDays === 0
                    ? "Vence hoje!"
                    : `Vence em ${diffDays} dias - use em breve!`
            );
        } else {
            setStatusBadge(undefined);
            setBannerMessage(undefined);
        }
    };

    // --- useFocusEffect Corrigido ---
    useFocusEffect(
        useCallback(() => {
            // 1. Cria a variável de controle usando uma referência mutável (objeto)
            const isActive = { value: true };

            // 2. Chama a função, passando a referência
            fetchItemData(isActive);

            // 3. Função de Cleanup: Roda no desfoque/desmontagem
            return () => {
                isActive.value = false; // Desativa a permissão para setState
            };
        }, [itemId]) // Garanta que o itemId esteja na dependência
    );

    return (
        <>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Loading />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Header da Seção (Item e Badge) */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{itemData?.nome}</Text>
                        {statusBadge && (
                            <View
                                style={[
                                    styles.badgeContainer,
                                    {
                                        backgroundColor:
                                            badgeColor[
                                                statusBadge as keyof typeof badgeColor
                                            ],
                                        borderColor:
                                            badgeTextColor[
                                                statusBadge as keyof typeof badgeTextColor
                                            ],
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.badgeText,
                                        {
                                            color: badgeTextColor[
                                                statusBadge as keyof typeof badgeTextColor
                                            ],
                                        },
                                    ]}
                                >
                                    {statusBadge}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Imagem do Produto */}
                    <Image
                        source={{
                            uri: itemData?.imagem ?? fallbackImg,
                        }}
                        style={styles.image}
                    />

                    {/* Banner de Aviso */}
                    {statusBadge && (
                        <View
                            style={[
                                styles.warningBanner,
                                {
                                    backgroundColor:
                                        badgeColor[
                                            statusBadge as keyof typeof badgeColor
                                        ],
                                    borderColor:
                                        badgeTextColor[
                                            statusBadge as keyof typeof badgeTextColor
                                        ],
                                },
                            ]}
                        >
                            <Ionicons
                                name="warning-outline"
                                size={24}
                                color={
                                    badgeTextColor[
                                        statusBadge as keyof typeof badgeTextColor
                                    ]
                                }
                            />
                            <Text
                                style={[
                                    styles.warningText,
                                    {
                                        color: badgeTextColor[
                                            statusBadge as keyof typeof badgeTextColor
                                        ],
                                    },
                                ]}
                            >
                                {bannerMessage}
                            </Text>
                        </View>
                    )}

                    {/* Seção de Informações */}
                    <View style={styles.infoContainer}>
                        {/* Coluna da Esquerda */}
                        <View style={styles.infoColumn}>
                            <InfoRow
                                iconName="category"
                                label="Categoria"
                                value={itemData?.categoria}
                            />
                            <InfoRow
                                iconName="bookmark-border"
                                label="Marca"
                                value={capitalizeFirstLetter(
                                    itemData?.marca as string
                                )}
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
                                value={`${itemData?.quantidade} ${itemData?.unidade_medida}`}
                            />
                            <InfoRow
                                iconName="calendar-today"
                                label="Validade"
                                value={formatExpirationDate(
                                    itemData?.data_validade!
                                )}
                            />
                            <InfoRow
                                iconName="attach-money"
                                label="Preço"
                                value={`R$ ${
                                    itemData?.preco?.toFixed(2) ?? "Sem dados"
                                }`}
                            />
                        </View>
                    </View>
                    <View style={styles.statusLabel}>
                        <Text style={styles.statusLabelText}>
                            {itemData?.status}
                        </Text>
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
            )}
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
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    image: {
        width: "100%",
        height: 250,

        alignSelf: "center",
        marginBottom: 16,
        borderRadius: 8,
    },
    warningBanner: {
        flexDirection: "row",
        alignItems: "center",

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
        marginBottom: 0,
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
    statusLabel: {
        backgroundColor: COLORS.secondaryLight,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: COLORS.seconday,
    },
    statusLabelText: {
        color: COLORS.seconday,
        fontWeight: "500",
        fontSize: 15,
    },
});

export default FoodItemView;
