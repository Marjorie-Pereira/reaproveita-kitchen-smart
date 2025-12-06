import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { recipe, recipeCategory } from "@/types/recipeType";
import { splitRecipeIngredients } from "@/utils/splitRecipeIngredients";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type recipeType = {
    id: number;
    imageUri: string;
    title: string;
    time: string;
    instructions: string;
    recipeIngredients: string[];
    category: recipeCategory;
};

type ingredientType = {
    id: number;
    ingredient: string;
    checked: boolean;
};

const IngredientItem = ({ name, checked, onPress }: any) => (
    <TouchableOpacity style={styles.ingredientRow} onPress={onPress}>
        <Text style={styles.ingredientText}>{name}</Text>
        <View>
            <MaterialIcons
                name={checked ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="#7C4C8D" // Cor de exemplo
            />
        </View>
    </TouchableOpacity>
);

const RecipeView = () => {
    const { recipeId, weekDay, mealType } = useLocalSearchParams();
    const { user } = useAuth();

    const [recipeData, setRecipeData] = useState<recipeType>();
    const [ingredients, setIngredients] = useState<ingredientType[]>([]);
    const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);

    const toggleCheck = (id: number) => {
        setIngredients((prevIngredients) =>
            prevIngredients?.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const fetchRecipeData = async () => {
        const { data, error } = await supabase
            .from("ReceitasCompletas")
            .select("*")
            .eq("id", recipeId)
            .single();
        if (error) {
            console.error(error);
        } else {
            const recipe = data as recipe;
            const ingredients = splitRecipeIngredients(recipe.ingredientes);
            const mappedData: recipeType = {
                id: recipe.id,
                category: recipe.categoria,
                imageUri: recipe.link_imagem,
                instructions: recipe.modo_preparo,
                recipeIngredients: ingredients,
                time: recipe.tempo_preparo,
                title: recipe.receita,
            };
            setRecipeData(mappedData);

            const ingredientsMapped = ingredients.map((ing, index) => {
                const ingredient: ingredientType = {
                    id: index,
                    ingredient: ing,
                    checked: false,
                };
                return ingredient;
            });
            setIngredients(ingredientsMapped);
        }
    };

    const checkIsRecipeSaved = async () => {
        if (!recipeId) return;
        const { data, error } = await supabase
            .from("ReceitasSalvas")
            .select("id_receita")
            .eq("id_receita", recipeId)
            .eq("id_usuario", user.id);
        if (error) {
            console.error(error);
        } else {
            

            setIsRecipeSaved(data?.length > 0);
        }
    };

    async function handleSaveRecipe() {
        if (!recipeData) return;
        console.log('salvando receita', recipeId);
        if (isRecipeSaved) {
            removeSavedRecipe();
            return;
        }

        const ingredientsString = recipeData?.recipeIngredients.join(", ");
        const { error } = await supabase.from("ReceitasSalvas").insert({
            id_receita: parseInt(recipeId as string),
            id_usuario: user.id,
            receita: recipeData.title,
            ingredientes: ingredientsString,
            modo_preparo: recipeData.instructions,
            link_imagem: recipeData.imageUri,
            tempo_preparo: recipeData.time,
            categoria: recipeData.category,
        });

        if (error) {
            console.error(error);
            Alert.alert("Erro ao salvar receita");
        } else {
            Alert.alert("Receita salva!");
            setIsRecipeSaved(true);
        }
    }

    //   remove from saved
    const removeSavedRecipe = async () => {
        if (!recipeId) return;
        const { error } = await supabase
            .from("ReceitasSalvas")
            .delete()
            .eq("id_receita", recipeId)
            .eq("id_usuario", user.id);
        if (error) {
            console.error(error);
            Alert.alert("Erro ao remover receita");
        } else {
            Alert.alert("Receita removida de Receitas Salvas");
            setIsRecipeSaved(false);
        }
    };

    async function handleAddMeal() {
        if (!recipeData) return;
        const { error } = await supabase.from("Refeicoes").insert({
            id_receita: recipeId,
            tipo: mealType,
            dia_da_semana: weekDay,
        });
        if (error) console.error(error);
        else {
            Alert.alert("Refeição Cadastrada!");
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchRecipeData();
            checkIsRecipeSaved();
            console.log('weekDay', weekDay)
            console.log('mealType', mealType)
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Bloco superior (Imagem, Título, Tempo, Botão) */}
                <View style={styles.recipeHeader}>
                    <View style={styles.imagePlaceholder}>
                        <Image
                            resizeMode="cover"
                            source={{
                                uri:
                                    recipeData?.imageUri ??
                                    "https://swiftbr.vteximg.com.br/arquivos/ids/208740/618283-pizza-artesanal-calabresa_inn.jpg?v=638870725352100000",
                            }}
                            style={styles.imagePlaceholder}
                        />
                    </View>
                    <View style={styles.recipeInfo}>
                        <Text style={styles.titleText}>
                            {recipeData?.title}
                        </Text>
                        <Text style={styles.infoText}>
                            Tempo de preparo: {recipeData?.time}
                        </Text>
                        <View style={styles.recipeActions}>
                            <Button
                                buttonStyle={{
                                    ...styles.saveButton,
                                    width: "65%",
                                    padding: 5,
                                }}
                                onPress={handleAddMeal}
                                variant="secondary"
                            >
                                <Text style={styles.buttonText}>
                                    Adicionar ao dia
                                </Text>
                            </Button>
                            <TouchableOpacity onPress={handleSaveRecipe}>
                                <FontAwesome
                                    name={isRecipeSaved ? "heart" : "heart-o"}
                                    size={24}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Modo de Preparo */}
                <Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
                    Modo de preparo
                </Text>
                <View style={{ paddingHorizontal: 20, gap: 10 }}>
                    {recipeData?.instructions.split(". ").map((inst, index) => (
                        <Text key={index} style={styles.instructionText}>{`${
                            index + 1
                        }. ${inst}.`}</Text>
                    ))}
                </View>

                {/* Ingredientes */}
                <Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
                    Ingredientes
                </Text>
                <View style={styles.ingredientsList}>
                    {ingredients?.map((item) => (
                        <IngredientItem
                            key={item.id}
                            name={item.ingredient}
                            checked={item.checked}
                            onPress={() => toggleCheck(item.id)} // Adicionando interatividade
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default RecipeView;

// --- Definição dos Estilos com StyleSheet.create ---
const PRIMARY_COLOR = "#7C4C8D";
const BACKGROUND_COLOR = "#FFFFFF";
const TEXT_COLOR = "#333333";
const LIGHT_GRAY = "#F0F0F0";
const GREEN_BUTTON = "#5CB85C";
const PADDING_HORIZONTAL = 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    paddingHorizontal: {
        paddingHorizontal: PADDING_HORIZONTAL,
    },

    // Estilos do cabeçalho de receita
    recipeHeader: {
        flexDirection: "row",
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 20,
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: LIGHT_GRAY,
        borderRadius: 8,
        marginRight: 15,
    },
    recipeInfo: {
        flex: 1,
        justifyContent: "space-around",
        gap: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: TEXT_COLOR,
    },
    infoText: {
        fontSize: 14,
        color: TEXT_COLOR,
        marginBottom: 5,
    },
    saveButton: {
        borderRadius: 20,
        alignSelf: "flex-start",
        alignItems: "center",
        marginBottom: 5,
        width: "50%",
    },
    buttonText: {
        color: BACKGROUND_COLOR,
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },

    // Estilos das seções de texto (Modo de preparo, Ingredientes)
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: TEXT_COLOR,
        marginTop: 20,
        marginBottom: 10,
    },
    instructionText: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
    },

    // Estilos da lista de ingredientes
    ingredientsList: {
        marginTop: 10,
        paddingHorizontal: PADDING_HORIZONTAL,
    },
    ingredientRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT_GRAY,
    },
    ingredientText: {
        fontSize: 16,
        color: TEXT_COLOR,
        flex: 1,
    },
    recipeActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
});
