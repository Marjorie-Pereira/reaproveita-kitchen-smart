import Loading from "@/components/Loading";
import { RecipeCard } from "@/components/RecipeCard";
import RecipeFilter from "@/components/RecipeFilter";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { recipe } from "@/types/recipeType";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const categoryMap = {
    breakfast: "Café da Manhã",
    lunch: "Almoço",
    dinner: "Janta",
};

const reverseCategoryMap = {
    "Café da Manhã": "breakfast",
    Almoço: "lunch",
    Janta: "dinner",
};

interface RecipeListHeaderProps {
    onTabSelect: (tab: "Salvas" | "Explorar") => void;
    selectedTab: string;
    toggleCategory: (category: string) => void;
    onSelectAll: () => void;
    activeFilters: string[];
    paramsCategory: string;
    onlyAvailableSelected: boolean;
    onSelectOnlyAvailable: () => void;
}

const RecipeListHeader = ({
    onTabSelect,
    selectedTab,
    toggleCategory,
    onSelectAll,
    activeFilters,
    paramsCategory,
    onlyAvailableSelected,
    onSelectOnlyAvailable,
}: RecipeListHeaderProps) => {
    return (
        <>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedTab === "Salvas" && styles.activeTab,
                    ]}
                    onPress={() => onTabSelect("Salvas")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === "Salvas" && styles.tabTextActive,
                        ]}
                    >
                        Salvas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        selectedTab === "Explorar" && styles.activeTab,
                    ]}
                    onPress={() => onTabSelect("Explorar")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            selectedTab === "Explorar" && styles.tabTextActive,
                        ]}
                    >
                        Explorar
                    </Text>
                </TouchableOpacity>
            </View>
            {/* 3. Título */}
            <Text style={styles.title}>Explorar Receitas</Text>

            {/* 5. Filtro (Somente ingredientes disponíveis) */}
            <RecipeFilter
                text="Ingredientes disponíveis"
                onPress={onSelectOnlyAvailable}
                isActive={onlyAvailableSelected}
            />

            {/* 6. Tags de Refeição */}
            <View style={styles.mealTagContainer}>
                {/* Tag "Todos" selecionada */}
                <RecipeFilter
                    text="Todos"
                    onPress={onSelectAll}
                    isActive={activeFilters.includes("all")}
                />

                {/* Outras Tags */}
                <RecipeFilter
                    text="Café da Manhã"
                    isActive={
                        paramsCategory == "Café da Manhã" ||
                        activeFilters.includes("breakfast")
                    }
                    onPress={() => {
                        toggleCategory("breakfast");
                    }}
                />
                <RecipeFilter
                    text="Almoço"
                    isActive={
                        paramsCategory == "Almoço" ||
                        activeFilters.includes("lunch")
                    }
                    onPress={() => {
                        toggleCategory("lunch");
                    }}
                />
                <RecipeFilter
                    text="Jantar"
                    isActive={
                        paramsCategory == "Janta" ||
                        activeFilters.includes("dinner")
                    }
                    onPress={() => {
                        toggleCategory("dinner");
                    }}
                />
            </View>
        </>
    );
};

const ExploreRecipesScreen = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState<"Salvas" | "Explorar">(
        "Explorar"
    );
    const [recipes, setRecipes] = useState<any[]>([]);
    const [allRecipes, setAllRecipes] = useState<any[]>([]);

    const [category, setCategory] = useState(params.category);
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function getFoodItems() {
        const { data, error } = await supabase
            .from("Alimentos")
            .select("nome")
            .eq("id_usuario", user.id);
        if (error) {
            console.error(error);
            return [];
        } else {
            return data.map(({ nome }) => nome.toLowerCase() as string);
        }
    }

    async function getRecipesByAvailableItems(recipes: any[]) {
        const rawAvailableItems: string[] = await getFoodItems();
        const availableItems = rawAvailableItems.map((i) =>
            i.trim().toLowerCase()
        );

        if (!recipes) return [];

        const correspondingRecipes = recipes.filter((recipe) => {
            let recipeIngredients: string[] = [];

            if (
                Array.isArray(recipe.ingredientes_base) &&
                recipe.ingredientes_base.length > 0
            ) {
                recipeIngredients = recipe.ingredientes_base;
            } else if (typeof recipe.ingredientes === "string") {
                recipeIngredients = recipe.ingredientes.split(/[,|;]+/);
            } else {
                return false;
            }

            recipeIngredients = recipeIngredients
                .map((i) => i.trim().toLowerCase())
                .filter((i) => i.length > 0);

            return recipeIngredients.some((recipeIngredient) => {
                return availableItems.some((availableItem) => {
                    const safeItem = availableItem.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );

                    const regex = new RegExp(`\\b${safeItem}\\b`, "i");

                    return (
                        recipeIngredient === availableItem ||
                        regex.test(recipeIngredient)
                    );
                });
            });
        });

        return correspondingRecipes;
    }

    const filterRecipes = (dataToFilter: recipe[] | undefined): recipe[] => {
        if (!dataToFilter) return [];
        let currentRecipes = dataToFilter;

        if (activeFilters.length > 0 && !activeFilters.includes("all")) {
            console.log("buscando pelas categorias", activeFilters);
            const mappedFilters = activeFilters.map(
                (filter) => categoryMap[filter as keyof typeof categoryMap]
            );
            currentRecipes = currentRecipes.filter((recipe) => {
                return [...mappedFilters, category].includes(recipe.categoria);
            });
        }

        if (search) {
            const formattedQuery = search.toLowerCase();
            currentRecipes = currentRecipes.filter((recipe) =>
                recipe.receita.toLowerCase().includes(formattedQuery)
            );
        }

        return currentRecipes;
    };

    function toggleCategory(newCategory: string) {
        const isCategoryActive = activeFilters.includes(newCategory);

        if (isCategoryActive) {
            const newFilters = activeFilters.filter(
                (active) => active !== newCategory && active !== "all"
            );

            if (newFilters.length === 0) {
                setActiveFilters(["all"]);
            } else {
                setActiveFilters(newFilters);
            }
        } else {
            const newFilters = activeFilters.filter(
                (active) => active !== "all"
            );
            setActiveFilters([...newFilters, newCategory]);
        }
    }

    const loadRecipes = useCallback(
        async (tab: "Explorar" | "Salvas") => {
            if (tab === "Salvas" && tab !== selectedTab) return;

            if (!user.id && tab === "Salvas") {
                setAllRecipes([]);
                setRecipes([]);
                return;
            }

            setIsLoading(true);
            try {
                const tableToQueryFrom =
                    tab === "Explorar" ? "ReceitasCompletas" : "ReceitasSalvas";

                let query = supabase.from(tableToQueryFrom).select("*");

                if (tab === "Salvas") {
                    query = query.eq("id_usuario", user.id);
                }

                const { data, error } = await query;

                if (error) throw Error(error.message);

                setAllRecipes(data as recipe[]);
                setRecipes(data as recipe[]);
            } catch (e) {
                console.error(e);
                setAllRecipes([]);
                setRecipes([]);
            } finally {
                setIsLoading(false);
            }
        },
        [user.id, selectedTab]
    );

    useEffect(() => {
        loadRecipes(selectedTab);
    }, [selectedTab, loadRecipes]);

    useEffect(() => {
        if (isLoading || !allRecipes || allRecipes.length === 0) return;

        let filtered = filterRecipes(allRecipes);
        if (onlyAvailable) {
            const applyAvailabilityFilter = async () => {
                const finalRecipes = await getRecipesByAvailableItems(filtered);
                setRecipes(finalRecipes ?? []);
            };
            applyAvailabilityFilter();
        } else {
            setRecipes(filtered);
        }
    }, [allRecipes, activeFilters, search, onlyAvailable, isLoading]);

    useFocusEffect(
        useCallback(() => {
            console.log("entrou na tela");

            if (selectedTab === "Salvas") {
                loadRecipes("Salvas");
            }

            if (params?.category) {
                setCategory(params.category);
                setActiveFilters([
                    reverseCategoryMap[
                        params.category as keyof typeof reverseCategoryMap
                    ],
                ]);
            }

            return () => {
                setSearch("");
            };
        }, [selectedTab, loadRecipes, params.category])
    );

    return (
        <>
            <View style={{ margin: 20 }}>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar receitas..."
                />
            </View>

            <FlatList
                data={recipes}
                contentContainerStyle={styles.contentContainer}
                keyExtractor={(item) => item.id as unknown as string}
                numColumns={2}
                renderItem={({ item }) => (
                    <RecipeCard
                        key={item.id}
                        title={item.receita}
                        time={item.tempo_preparo}
                        id={item.id}
                        imageUri={item.link_imagem}
                        style={styles.recipeCardContainer}
                        onPress={() =>
                            router.navigate({
                                pathname: "/main/meals/[recipe]",
                                //@ts-ignore
                                params: {
                                    recipeId:
                                        selectedTab === "Explorar"
                                            ? item.id
                                            : item.id_receita,
                                    weekDay: params.weekDay,
                                    mealType: params.category,
                                },
                            })
                        }
                    />
                )}
                ListHeaderComponent={() => (
                    <RecipeListHeader
                        activeFilters={activeFilters}
                        onSelectAll={() => {
                            setActiveFilters(["all"]);
                            setCategory("");
                        }}
                        onSelectOnlyAvailable={() => {
                            setOnlyAvailable((prev) => !prev);
                        }}
                        onTabSelect={setSelectedTab}
                        onlyAvailableSelected={onlyAvailable}
                        paramsCategory={category as string}
                        selectedTab={selectedTab}
                        toggleCategory={toggleCategory}
                    />
                )}
                ListFooterComponent={isLoading ? <Loading /> : null}
                onEndReachedThreshold={0.2}
                ListEmptyComponent={() => (
                    <View>
                        <Text>Nenhuma receita encontada</Text>
                    </View>
                )}
            />
        </>
    );
};

export default ExploreRecipesScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 0,
        margin: 0,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },

    tabContainer: {
        flexDirection: "row",
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 10,
        marginHorizontal: 40,
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5e4ef",
    },
    activeTab: {
        backgroundColor: "#b53f84",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
    },
    tabTextActive: {
        color: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 10,
        marginTop: 0,
    },

    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 50,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#eee",
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        padding: 8,
        fontSize: 16,
        color: "black",
    },

    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8a4d7d",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginVertical: 8,
        marginLeft: 4,
    },
    filterButtonText: {
        color: "#fff",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 14,
    },

    mealTagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 10,
    },
    mealTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5dee7",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    mealTagSelected: {
        backgroundColor: "#8a4d7d",
    },
    mealTagText: {
        color: "#8a4d7d",
        fontWeight: "600",
    },
    mealTagTextSelected: {
        color: "#fff",
        marginLeft: 4,
    },

    recipeCardContainer: {
        width: "40%",
        margin: 5,
        backgroundColor: "#dce1dcff",
        borderRadius: 8,
        alignItems: "flex-start",
        overflow: "hidden",
        flex: 1,
    },
});
