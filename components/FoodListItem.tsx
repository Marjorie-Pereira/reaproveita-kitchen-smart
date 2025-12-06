import { FoodListItemProps } from "@/types/FoodListItemProps";
import { formatExpirationDate } from "@/utils/dateFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const badgeColor = {
    Vencendo: "#FEF9C2",
    Vencido: "#FFE3E2",
};

const badgeTextColor = {
    Vencendo: "#B7950B",
    Vencido: "#9E2B35",
};
const FoodListItem = ({
    imageUri,
    name,
    brand,
    category,
    volume,
    expiresIn,
    onItemPress,
}: FoodListItemProps) => {
    const expiringDays = 7;
    const expirationDate = new Date(expiresIn);
    const currentDate = new Date();
    const [status, setStatus] = useState<string>();

    useEffect(() => {
        const yearsDifference =
            expirationDate.getFullYear() - currentDate.getFullYear();

        if (expirationDate.getTime() < currentDate.getTime()) {
            setStatus("Vencido");
        } else if (
            differenceInDays(expirationDate, currentDate) <= expiringDays &&
            yearsDifference === 0
        ) {
            setStatus("Vencendo");
        }
    }, [expiresIn]);

    return (
        <TouchableOpacity onPress={onItemPress}>
            <View style={styles.container}>
                {/* Imagem do Produto */}
                <Image
                    source={{ uri: imageUri }}
                    style={styles.productImage}
                    resizeMode="contain"
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{name}</Text>
                    <Text style={styles.productBrand}>{brand}</Text>
                    <Text style={styles.productCategory}>{category}</Text>
                    <Text style={styles.productVolume}>{volume}</Text>
                </View>

                <View style={styles.expirationDateContainer}>
                    {status ? (
                        <View style={{ flex: 1 }}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor:
                                            badgeColor[
                                                status as keyof typeof badgeColor
                                            ],
                                            borderRadius: 8
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: badgeTextColor[
                                                status as keyof typeof badgeTextColor
                                            ],
                                        },
                                    ]}
                                >
                                    {status}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}></View>
                    )}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <MaterialIcons
                            name="calendar-today"
                            size={18}
                            color="#555"
                        />
                        <Text>{formatExpirationDate(expiresIn)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        width: "100%",
        elevation: 3,
    },
    productImage: {
        width: 60,
        height: 80,
        marginRight: 15,
    },
    detailsContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    productBrand: {
        fontSize: 14,
        color: "#666",
    },
    productCategory: {
        fontSize: 14,
        color: "#888",
    },
    productVolume: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6F4E37",
    },
    expirationDateContainer: {
        alignItems: "flex-end",
        gap: 20,
    },
});

export default FoodListItem;
