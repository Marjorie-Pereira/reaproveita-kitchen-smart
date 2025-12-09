import SearchBar from "@/components/SearchBar";
import { supabase } from "@/lib/supabase";
import { getLocationId } from "@/utils/locationUtils";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import Loading from "@/components/Loading";
import { MealCard } from "@/components/MealCard";
import { useAuth } from "@/contexts/AuthContext";
import { mealObject } from "@/types/mealObject.type";
import { formatDate } from "date-fns";
import { Text } from "react-native";

const Leftovers = () => {
    const [location, setLocation] = useState<"Geladeira" | "Freezer">(
        "Geladeira"
    );
    const [leftovers, setLeftovers] = useState<mealObject[]>([]);
    const [allLeftovers, setAllLeftOvers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setsSearch] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    async function fetchLeftoversFromLocation(
        location: "Geladeira" | "Freezer"
    ) {
        const { id } = await getLocationId(location);

        setIsLoading(true);
        const { data, error } = await supabase
            .from("Refeicoes")
            .select("*, ReceitasCompletas(receita)")
            .eq("tem_sobras", true)
            .eq("id_usuario", user?.id);

        if (error) {
            setIsLoading(false);
            setLeftovers([]);
            throw Error(error.message);
        }

        setLeftovers(data);
        setAllLeftOvers(data);
        setIsLoading(false);
    }

    const handleSearch = (query: string) => {
        setsSearch(query);
        setIsLoading(true);
        const formattedQuery = query.trim().toLowerCase();

        const filtered = allLeftovers.filter((lto) => {
            const { receita } = lto["ReceitasCompletas"];
            const recipeName: string = receita;

            return recipeName.toLowerCase().includes(formattedQuery);
        });

        setLeftovers(filtered);
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchLeftoversFromLocation(location);

            return () => {
                setsSearch("");
            };
        }, [location])
    );

    return (
        <>
            <View style={{flex: 1, marginBottom: 10}}>
                <SearchBar
                    placeholder="Pesquisar itens..."
                    value={search}
                    onChangeText={handleSearch}
                    style={{margin: 20}}
                />

                <ScrollView
                    
                >
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <View style={styles.foodItemsGrid}>
                            {leftovers.map((item: mealObject) => {
                                return (
                                    <MealCard
                                        key={item.id}
                                        id={item.id!}
                                        recipeId={item.id_receita}
                                        type={"Almoço"}
                                        style={styles.mealCard}
                                        onPress={() => {
                                            router.push({
                                                pathname:
                                                    "/main/home/leftovers/leftover",
                                                params: { mealId: item.id },
                                            });
                                        }}
                                        leftoverDate={formatDate(
                                            item.data_sobras,
                                            "dd/MM/yyyy"
                                        )}
                                    />
                                );
                            })}
                        </View>
                    )}
                    {leftovers.length === 0 && (
                        <View>
                            <Text>Nenhuma sobra encontrada</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    foodItemsGrid: {
        width: "100%",
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 10,
        marginHorizontal: 10,
       
       
    },
    mealCard: {
       width: '45%'
    },
});

export default Leftovers;
