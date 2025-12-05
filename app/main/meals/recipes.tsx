import { RecipeCard } from "@/components/RecipeCard";
import RecipeFilter from "@/components/RecipeFilter";
import { supabase } from "@/lib/supabase";
import { mealType } from "@/types/mealTypeEnum";
import { recipe } from "@/types/recipeType";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import filter from "lodash.filter";
import React, { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const categoryMap = {
    breakfast: "Café da Manhã",
    lunch: "Almoço",
    dinner: "Janta",
};

const ExploreRecipesScreen = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<"Salvas" | "Explorar">(
        "Explorar"
    );
    const [recipes, setRecipes] = useState<recipe[]>([]);
    const [allRecipes, setAllRecipes] = useState<recipe[]>([]);

    const [category, setCategory] = useState(params.category);
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    async function getRecipes(limit: number) {
        const tableToQueryFrom =
            selectedTab === "Explorar" ? "ReceitasCompletas" : "ReceitasSalvas";
        const { data, error } = await supabase
            .from(tableToQueryFrom)
            .select("*")
            .limit(limit);

        if (error) throw Error(error.message);

        setRecipes(data);
        setAllRecipes(data);

        
    }

    async function getFoodItems() {
        const { data, error } = await supabase.from("Alimentos").select("nome");
        if (error) throw new Error(error.message);

        return data.map(({ nome }) => nome.toLowerCase() as string);
    }

    async function getRecipesByAvailableItems() {
        console.log('bucando receitas com os ingredientes disponivbeiw')
        const availableItems: string[] = await getFoodItems();

        const correspondingRecipes: recipe[] = recipes.filter((recipe) => {
            // 1. Unificar a obtenção e limpeza dos ingredientes da receita
            let recipeIngredients: string[];

            if (
                recipe.ingredientes_base &&
                recipe.ingredientes_base.length > 0
            ) {
                // Se existe o array 'ingredientes_base', use-o
                recipeIngredients = recipe.ingredientes_base.map((ingredient) =>
                    ingredient.toLowerCase()
                );
            } else if (typeof recipe.ingredientes === "string") {
                // Se 'ingredientes' é uma string, faça a divisão
                const separator = recipe.ingredientes.includes(",")
                    ? ", "
                    : "| ";
                recipeIngredients = recipe.ingredientes
                    .toLowerCase()
                    .split(separator);
            } else {
                // Caso não tenha ingredientes válidos (ou seja null/undefined)
                return false;
            }

            // 2. Usar Set e flat() é desnecessário aqui, basta o array limpo

            // 3. Verifica se **algum** item disponível corresponde a **algum** ingrediente da receita
            return recipeIngredients.some((recipeIngredient) =>
                availableItems.some((availableItem) => {
                    // Correspondência por Substring (mesma lógica que você usou)
                    return (
                        availableItem.includes(recipeIngredient) ||
                        recipeIngredient.includes(availableItem)
                    );
                })
            );
        });

        // A variável 'correspondingRecipes' agora contém apenas as receitas com ingredientes disponíveis.

        console.log(correspondingRecipes);
        setRecipes(correspondingRecipes);
    }

    async function getRecipesByCategory() {
        if (activeFilters.includes("all")) return;
        const tableToQueryFrom =
            selectedTab === "Explorar" ? "ReceitasCompletas" : "ReceitasSalvas";

        const categories = activeFilters.map(
            (filter) => categoryMap[filter as keyof typeof categoryMap]
        );

        const { data, error } = await supabase
            .from(tableToQueryFrom)
            .select("*")
            .in("categoria", [...categories, category]);
        if (error) throw new Error(error.message);

        setRecipes(data);
        setAllRecipes(data);

        
    }

    const handleSearch = (query: string) => {
        setSearch(query);
        const formattedQuery = query.toLowerCase();
        const formattedData = filter(allRecipes, (recipe: recipe) => {
            return recipe.receita.toLowerCase().includes(formattedQuery);
        });

        setRecipes(formattedData);
    };

    const fetchData = async () => {
        if (activeFilters.includes("all")) await getRecipes(20);
        else await getRecipesByCategory();

        if(onlyAvailable) await getRecipesByAvailableItems();
    }

    useEffect(() => {
        fetchData();
        
    }, [activeFilters, onlyAvailable]);

    useEffect(() => {
        setSearch("");
        fetchData();
    }, [selectedTab]);

    // useEffect(() => {
    //     if (onlyAvailable) {
    //         console.log('buscando recitas com ingredientes disponíveis...')
    //         getRecipesByAvailableItems()
    //     };
    // }, [onlyAvailable, activeFilters]);

    // useEffect(() => {
    //     console.log("receitas mudaram");
    // }, [recipes]);

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused

            setCategory(params.category);
            getRecipesByCategory();
            return () => {
                console.log("resetar coisas");
            };
        }, [])
    );

    // function toggleCategory(category: string) {
    //   if (!selectedCategories.includes(category)) {
    //     setSelectedCategories((prev) => [...prev, category]);
    //   } else {
    //     const index = selectedCategories.indexOf(category);
    //     const newValue = [...selectedCategories];
    //     newValue.splice(index, 1);
    //     setSelectedCategories(newValue);
    //   }
    // }

    return (
        <>
            {/* transformar em flatlist */}
            <ScrollView>
                <View style={styles.contentContainer}>
                    {/* 2. Tabs (Salvas / Explorar) */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                selectedTab === "Salvas" && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab("Salvas")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "Salvas" &&
                                        styles.tabTextActive,
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
                            onPress={() => setSelectedTab("Explorar")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedTab === "Explorar" &&
                                        styles.tabTextActive,
                                ]}
                            >
                                Explorar
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* 3. Título */}
                    <Text style={styles.title}>Explorar Receitas</Text>

                    {/* 4. Barra de Pesquisa */}
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar receitas"
                            placeholderTextColor="#999"
                            value={search}
                            onChangeText={handleSearch}
                        />
                        <MaterialIcons
                            name="search"
                            size={24}
                            color="#777"
                            style={{ marginHorizontal: 8 }}
                        />
                    </View>

                    {/* 5. Filtro (Somente ingredientes disponíveis) */}
                    <RecipeFilter
                        text="Somente ingredientes disponíveis"
                        onPress={() => {
                            setOnlyAvailable((prev) => !prev);
                            
                        }}
                        isActive={onlyAvailable}
                    />

                    {/* 6. Tags de Refeição */}
                    <View style={styles.mealTagContainer}>
                        {/* Tag "Todos" selecionada */}
                        <RecipeFilter
                            text="Todos"
                            onPress={() => {
                                if (!activeFilters.includes("all")) {
                                    setActiveFilters(["all"]);
                                    setCategory("");
                                } else {
                                    setActiveFilters([]);
                                    router.setParams({ category: null });
                                }
                            }}
                            isActive={activeFilters.includes("all")}
                        />

                        {/* Outras Tags */}
                        <RecipeFilter
                            text="Café da Manhã"
                            isActive={
                                category == "Café da Manhã" ||
                                activeFilters.includes("breakfast")
                            }
                            onPress={() => {
                                if (activeFilters.includes("breakfast")) {
                                    const newValue = activeFilters.filter(
                                        (category) => category != "breakfast"
                                    );
                                    setActiveFilters(newValue);
                                } else {
                                    if (activeFilters[0] == "all") {
                                        setActiveFilters([]);
                                    }
                                    setActiveFilters((prev) => [
                                        ...prev,
                                        "breakfast",
                                    ]);
                                }
                            }}
                        />
                        <RecipeFilter
                            text="Almoço"
                            isActive={
                                category == "Almoço" ||
                                activeFilters.includes("lunch")
                            }
                            onPress={() => {
                                if (activeFilters[0] == "all") {
                                    setActiveFilters([]);
                                } else if (activeFilters.includes("lunch")) {
                                    const index =
                                        activeFilters.indexOf("lunch");
                                    const newValue = activeFilters;
                                    newValue.splice(index, 1);
                                    setActiveFilters(newValue);
                                    return;
                                }

                                setActiveFilters((prev) => [...prev, "lunch"]);
                            }}
                        />
                        <RecipeFilter
                            text="Jantar"
                            isActive={
                                category == "Janta" ||
                                activeFilters.includes("dinner")
                            }
                            onPress={() => {
                                if (activeFilters[0] == "all") {
                                    setActiveFilters([]);
                                } else if (activeFilters.includes("dinner")) {
                                    const index =
                                        activeFilters.indexOf("dinner");
                                    const newValue = activeFilters;
                                    newValue.splice(index, 1);
                                    setActiveFilters(newValue);
                                    return;
                                }

                                setActiveFilters((prev) => [...prev, "dinner"]);
                            }}
                        />
                    </View>
                    {/* 7. Lista de Receitas (FlatList) */}
                    {/* 7. Lista de Receitas (Substituída por View e map) */}
                    <View style={styles.recipeGrid}>
                        {recipes &&
                            recipes.map((recipe: recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    title={recipe.receita}
                                    time={recipe.tempo_preparo}
                                    id={recipe.id}
                                    imageUri={recipe.link_imagem}
                                    instructions={recipe.modo_preparo}
                                    ingredients={recipe.ingredientes.split(
                                        "| "
                                    )}
                                    mealType={category as mealType}
                                    isSaved={selectedTab === "Salvas"}
                                    weekDay={params.weekDay as string}
                                />
                            ))}
                        {recipes.length === 0 && (
                            <Text>Nenhuma receita encontrada</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

// Se você estiver no Expo, exporte o componente para exibição
export default ExploreRecipesScreen;

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 0,
        margin: 0, // Fundo claro geral
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#f5f0f7", // Fundo Roxo-Claro da tela
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    // --- 2. Tabs ---
    tabContainer: {
        flexDirection: "row",
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 10, // Para mover a aba para cima (sobrepondo o header)
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
    // --- 4. Barra de Pesquisa ---
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
    // --- 5. Filtro ---
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8a4d7d", // Cor principal do filtro (Roxo)
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: "flex-start", // Ocupa apenas o espaço necessário
        marginVertical: 8,
        marginLeft: 4,
    },
    filterButtonText: {
        color: "#fff",
        marginLeft: 6,
        fontWeight: "600",
        fontSize: 14,
    },
    // --- 6. Tags de Refeição ---
    mealTagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 10,
    },
    mealTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5dee7", // Cor de fundo das tags (Rosa Claro)
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    mealTagSelected: {
        backgroundColor: "#8a4d7d", // Cor de fundo da tag selecionada (Roxo)
    },
    mealTagText: {
        color: "#8a4d7d", // Cor do texto das tags
        fontWeight: "600",
    },
    mealTagTextSelected: {
        color: "#fff", // Cor do texto da tag selecionada
        marginLeft: 4,
    },
    recipeGrid: {
        // ESTILO NOVO: Permite que os cards se quebrem em múltiplas linhas
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between", // Distribui o espaço entre 3 colunas
        marginTop: 10,
        paddingBottom: 20, // Espaço no final da rolagem
    },
    recipeCardContainer: {
        // Ajustado para o novo layout de View + wrap
        width: "31%", // Pouco menos de 1/3 para deixar margem
        marginBottom: 10,
        backgroundColor: "#d8ead8",
        borderRadius: 8,
        alignItems: "flex-start",
        overflow: "hidden",
    },
});
