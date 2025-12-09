import Loading from "@/components/Loading";
import { RecipeCard } from "@/components/RecipeCard";
import RecipeFilter from "@/components/RecipeFilter";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { recipe } from "@/types/recipeType";
import { splitRecipeIngredients } from "@/utils/splitRecipeIngredients";
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

interface compatibleRecipeType extends recipe {
    missingIngredients: string[];
    isFullyCompatible: boolean;
    matchPercentage: number;
}

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
            {/* <RecipeFilter
                text="Ingredientes disponíveis"
                onPress={onSelectOnlyAvailable}
                isActive={onlyAvailableSelected}
            /> */}

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

    const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [foodRestrictions, setFoodRestrictions] = useState<string[]>();
    const [leftoverIngredients, setLeftoverIngredients] = useState<string[]>();

    const normalizeIngredient = (texto: string) => {
        return texto
            .toLowerCase()
            .normalize("NFD") // Separa os acentos das letras
            .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos
    };

    async function getFoodRestrictions() {
        const { data, error } = await supabase
            .from("RestricoesAlimentares")
            .select("descricao")
            .eq("id_usuario", user?.id);

        if (error) {
            console.error(error);
            return;
        }

        const restrictions = data?.map((rest) => rest?.descricao as string);
        setFoodRestrictions(restrictions);
        return restrictions;
    }

    async function getLeftoverIngredients() {
        const { data, error } = await supabase
            .from("Refeicoes")
            .select("ReceitasCompletas(ingredientes)")
            .eq("id", params.leftoverId)
            .single();

        if (error) {
            console.error(error);
            return;
        } else {
            const recipeData = data["ReceitasCompletas"] as any;
            const ingredients = recipeData["ingredientes"];
            const splitIngredients = splitRecipeIngredients(ingredients);

            return splitIngredients;
        }
    }

    const filterRecipes = (dataToFilter: recipe[] | undefined): recipe[] => {
        if (!dataToFilter) return [];
        let currentRecipes = dataToFilter;

        if (activeFilters.length > 0 && !activeFilters.includes("all")) {
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
        const isCategoryActive =
            activeFilters.includes(newCategory) ||
            category === categoryMap[newCategory as keyof typeof categoryMap];

        if (isCategoryActive) {
            setCategory("");
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

    function getCompatibleRecipes(
        recipes: recipe[],
        leftoverIngredients?: string[]
    ) {
        // 1. Mapeamos para calcular o que tem e o que falta
        const recipesWithStatus = recipes.map((rec) => {
            const recipeIngredients = splitRecipeIngredients(rec.ingredientes);

            // Filtra o que FALTA
            const missingIngredients = recipeIngredients.filter(
                (ingredienteDaReceita) => {
                    const tenhoEste = leftoverIngredients?.some((minhaSobra) =>
                        normalizeIngredient(ingredienteDaReceita).includes(
                            normalizeIngredient(minhaSobra)
                        )
                    );
                    return !tenhoEste;
                }
            );

            // Calculamos quantos ingredientes deram MATCH
            const matchedCount =
                recipeIngredients.length - missingIngredients.length;

            return {
                ...rec,
                missingIngredients,
                matchedCount, // Quantos eu tenho
                matchPercentage: matchedCount / recipeIngredients.length,
            };
        });

        // 2. FILTRAGEM CORRIGIDA
        // Queremos receitas onde encontramos PELO MENOS 1 ingrediente (matchedCount > 0)
        const finalSuggestions = recipesWithStatus.filter(
            (r) => r.matchedCount > 0
        );

        // 3. ORDENAÇÃO (Opcional, mas recomendado)
        // Coloca primeiro as receitas onde você tem mais ingredientes (maior %)
        finalSuggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // 4. Limpeza para retornar ao tipo original (remove os campos auxiliares)
        return finalSuggestions.map((rec) => {
            const {
                matchPercentage,
                missingIngredients,
                matchedCount,
                ...rest
            } = rec;
            return rest;
        });
    }

    const loadRecipes = useCallback(
        async (tab: "Explorar" | "Salvas", userRestrictions?: string[]) => {
            if (tab === "Salvas" && tab !== selectedTab) return;

            if (!user.id && tab === "Salvas") {
                setAllRecipes([]);
                setRecipes([]);
                return;
            }

            setIsLoading(true);
            const restrictions = userRestrictions ?? foodRestrictions;

            try {
                const tableToQueryFrom =
                    tab === "Explorar" ? "ReceitasCompletas" : "ReceitasSalvas";

                let query = supabase.from(tableToQueryFrom).select("*");

                if (tab === "Salvas") {
                    query = query.eq("id_usuario", user.id);
                }

                const { data, error } = await query;

                if (error) throw Error(error.message);

                const leftoverIngredients = await getLeftoverIngredients();
                const compatibleRecipes = getCompatibleRecipes(
                    data,
                    leftoverIngredients
                );
                console.log("compatible", compatibleRecipes.length);

                if (
                    restrictions &&
                    restrictions.length > 0 &&
                    selectedTab === "Explorar"
                ) {
                    const filteredData = compatibleRecipes.filter((recipe) => {
                        const recipeRestrictions: string[] =
                            recipe.restricoes?.split(", ");

                        const notAllowed = recipeRestrictions.some((item) =>
                            restrictions.includes(item)
                        );

                        return !notAllowed;
                    });

                    setAllRecipes(filteredData as recipe[]);
                    setRecipes(filteredData as recipe[]);
                } else {
                    setAllRecipes(compatibleRecipes as recipe[]);
                    setRecipes(compatibleRecipes as recipe[]);
                }
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
        setRecipes(filtered);
    }, [allRecipes, activeFilters, search, isLoading]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initScreen = async () => {
                if (params?.category) {
                    setCategory(params.category);
                    setActiveFilters([
                        reverseCategoryMap[
                            params.category as keyof typeof reverseCategoryMap
                        ],
                    ]);
                }

                if (selectedTab === "Salvas") {
                    if (isActive) {
                        loadRecipes("Salvas");
                    }
                } else {
                    try {
                        const freshRestrictions = await getFoodRestrictions();

                        if (isActive) {
                            loadRecipes(selectedTab, freshRestrictions);
                        }
                    } catch (error) {
                        console.error("Erro ao carregar restrições", error);

                        if (isActive) loadRecipes(selectedTab, []);
                    }
                }
            };

            initScreen();

            return () => {
                isActive = false;
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
                            router.push({
                                pathname: "/main/home/recipes/recipeView",
                                //@ts-ignore
                                params: {
                                    recipeId:
                                        selectedTab === "Explorar"
                                            ? item.id
                                            : item.id_receita,
                                   
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
                        onSelectOnlyAvailable={() => {}}
                        onTabSelect={setSelectedTab}
                        onlyAvailableSelected={true}
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
        flex: 1,
    },
});
