import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Input from "@/components/Input";
import SwitchBtn from "@/components/SwitchBtn";
import { supabase } from "@/lib/supabase";
import { recipe } from "@/types/recipeType";
import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const weekDayMap = {
    Segunda: "Segunda-feira",
    Terca: "Terça-feira",
    Quarta: "Quarta-feira",
    Quinta: "Quinta-feira",
    Sexta: "Sexta-feira",
    Sabado: "Sábado",
    Domingo: "Domingo",
};

export default function MealViewScreen() {
    const { meal: mealId, recipeId } = useLocalSearchParams();
    const [meal, setMeal] = useState<any>();
    const [recipeData, setRecipeData] = useState<recipe>();
    const [isConsumed, setIsConsumed] = useState(false);
    const [hasLeftovers, setHasLeftovers] = useState(false);
    const [keyboardAvoid, setKeyboardAvoid] = useState(false);
    const [leftoverPortions, setLeftoverPortions] = useState<number | null>(
        null
    );
    const router = useRouter();
    const height = useHeaderHeight();

    function seeRecipe() {
        if (recipeData) {
            router.navigate({
                pathname: "/main/meals/[recipe]",
                //@ts-ignore
                params: { recipeId },
            });
        }
    }

    async function fetchMeal() {
        const { data, error } = await supabase
            .from("Refeicoes")
            .select("*")
            .eq("id", mealId);
        if (error) throw new Error(error.message);
        setMeal(data[0]);

        setHasLeftovers(data[0].tem_sobras);
        setIsConsumed(data[0].foi_consumida);
        setLeftoverPortions(data[0].porcoes);
    }

    async function fetchRecipe() {
        if (!recipeId) return;
        console.log(recipeId);
        const { data, error } = await supabase
            .from("ReceitasCompletas")
            .select("*")
            .eq("id", parseInt(recipeId as string))
            .single();
        if (error) console.error(error);
        else setRecipeData(data);
    }

    async function updateMealState(
        newConsumedValue: boolean | undefined,
        newLeftoversValue: boolean | undefined
    ) {
        const { error } = await supabase
            .from("Refeicoes")
            .update({ tem_sobras: newLeftoversValue, data_sobras: new Date() })
            .eq("id", mealId);
        const { error: secondError } = await supabase
            .from("Refeicoes")
            .update({ foi_consumida: newConsumedValue })
            .eq("id", mealId);

        if (error || secondError)
            throw new Error(error ? error.message : secondError?.message);
    }

    async function updateLeftoverPortions() {
        const newValue =
            leftoverPortions?.toString().length === 0 ? null : leftoverPortions;
        const { error } = await supabase
            .from("Refeicoes")
            .update({ porcoes: newValue })
            .eq("id", mealId);
        if (error) throw new Error(error.message);
        Alert.alert("Alterações salvas!");
    }

    useEffect(() => {
        fetchMeal();
        fetchRecipe();
    }, [mealId]);

    async function onDeleteMeal() {
        const { error } = await supabase
            .from("Refeicoes")
            .delete()
            .eq("id", mealId);
        if (error) throw new Error(error.message);
        Alert.alert("Refeição Deletada!");
        router.back();
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={height - 165}
            behavior="padding"
            style={[styles.container]}
            enabled={keyboardAvoid}
        >
            <ScrollView>
                <View>
                    {/* Main Card */}
                    <View style={styles.card}>
                        <Image
                            resizeMode="cover"
                            source={{
                                uri:
                                    recipeData?.link_imagem ??
                                    "https://gnesjjmiiharouctxukk.supabase.co/storage/v1/object/public/app_bucket_public/placeholder.png",
                            }}
                            style={{
                                width: "80%",
                                aspectRatio: 1,
                                marginBottom: 10,
                                alignSelf: "center",
                            }}
                        />
                        {/* Recipe Name */}
                        <View style={styles.cardSection}>
                            <Text style={styles.h2}>{recipeData?.receita}</Text>

                            <View style={styles.detailsRow}>
                                <Badge mealType={meal?.tipo} />

                                <View style={styles.calendarContainer}>
                                    <Feather
                                        name="calendar"
                                        size={16}
                                        color="#4B5563"
                                    />
                                    <Text style={styles.calendarText}>
                                        {
                                            weekDayMap[
                                                meal?.dia_da_semana as keyof typeof weekDayMap
                                            ]
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Options */}

                        <View style={styles.cardSectionOptions}>
                            {/* Consumed Checkbox */}
                            <SwitchBtn
                                id="consumed"
                                checked={isConsumed}
                                onCheckedChange={(checked) => {
                                    Alert.alert(
                                        "Tem certeza?",
                                        "Essas alterações não podem ser desfeitas!",
                                        [
                                            {
                                                text: "Cancelar",
                                                onPress: () => null,
                                                style: "cancel",
                                            },
                                            {
                                                text: "Sim",
                                                onPress: () => {
                                                    setIsConsumed(checked);
                                                    updateMealState(
                                                        checked,
                                                        undefined
                                                    );
                                                },
                                            },
                                        ]
                                    );
                                }}
                                label="Marcar como consumido"
                                disabled={isConsumed}
                            />

                            {
                                //   meal?.consumed && (
                                //     <View style={styles.timeInputContainer}>
                                //       <View style={styles.timeLabelContainer}>
                                //         <Icon name="clock" size={14} color="#4B5563" />
                                //         <Text style={styles.timeLabelText}>Hora do consumo</Text>
                                //       </View>
                                //       {/* Note: RN TextInput does not have a 'type="time"'.
                                //           You would typically use a DatePicker component for time input in a real app.
                                //           Here, we use a simple TextInput for the refactoring purpose. */}
                                //       <RNInput
                                //         value={meal?.timeConsumed}
                                //         onChangeText={onTimeChange}
                                //         placeholder="Ex: 12:30"
                                //         style={styles.timeInput}
                                //       />
                                //     </View>
                                //   )
                            }
                            {/* Leftovers Checkbox */}
                            {isConsumed && (
                                <SwitchBtn
                                    id="leftovers"
                                    checked={hasLeftovers}
                                    onCheckedChange={(checked) => {
                                        Alert.alert(
                                            "Tem certeza?",
                                            "Essas alterações não podem ser desfeitas!",
                                            [
                                                {
                                                    text: "Cancelar",
                                                    onPress: () => null,
                                                    style: "cancel",
                                                },
                                                {
                                                    text: "Sim",
                                                    onPress: () => {
                                                        setHasLeftovers(
                                                            checked
                                                        );
                                                        updateMealState(
                                                            undefined,
                                                            checked
                                                        );
                                                    },
                                                },
                                            ]
                                        );
                                    }}
                                    label="Tem sobras"
                                    disabled={hasLeftovers}
                                />
                            )}
                            {hasLeftovers && (
                                <Input
                                    value={leftoverPortions}
                                    onChangeText={(val: number) => {
                                        setLeftoverPortions(val);
                                    }}
                                    keyboardType="numeric"
                                    placeholder="Número estimado de porções"
                                    onFocus={() => setKeyboardAvoid(true)}
                                    onBlur={() => {
                                        setKeyboardAvoid(false);
                                        updateLeftoverPortions();
                                    }}
                                />
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.cardSectionActions}>
                            <Button
                                onPress={seeRecipe}
                                buttonStyle={styles.actionButton}
                                variant="primary"
                            >
                                <Feather
                                    name="book-open"
                                    size={16}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.buttonText}>
                                    Ver Receita
                                </Text>
                            </Button>

                            <Button
                                onPress={() => {
                                    Alert.alert(
                                        "Cuidado",
                                        "Tem certeza que deseja remover esta refeição da semana?",
                                        [
                                            {
                                                text: "Cancelar",
                                                onPress: () => null,
                                                style: "cancel",
                                            },
                                            {
                                                text: "Sim",
                                                onPress: onDeleteMeal,
                                            },
                                        ]
                                    );
                                }}
                                buttonStyle={styles.actionButton}
                                variant="destructive"
                            >
                                <Feather
                                    name="trash-2"
                                    size={16}
                                    color="#FFFFFF"
                                />

                                <Text style={styles.buttonText}>
                                    Remover Refeição
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        maxWidth: 400, 
        alignSelf: "center",        width: "100%",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2, 
        borderWidth: 1,
        borderColor: "#E5E7EB", 
        overflow: "hidden",
    },
    cardSection: {
        padding: 24,
        borderBottomWidth: 1,
        borderColor: "#F3F4F6",
    },
    cardSectionOptions: {
        padding: 24, 
        paddingVertical: 16,
        gap: 16,
    },
    cardSectionActions: {
        padding: 24, 
        paddingTop: 8, 
        gap: 12, 
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12, 
        color: "#1F2937", 
    },
    detailsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12, 
        flexWrap: "wrap",
    },
    calendarContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6, 
        color: "#4B5563", 
    },
    calendarText: {
        fontSize: 14, 
        color: "#4B5563",
    },

    timeInputContainer: {
        marginLeft: 32, 
        gap: 8, 
    },
    timeLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6, 
    },
    timeLabelText: {
        fontSize: 14, 
        color: "#4B5563", 
    },
    timeInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#D1D5DB", 
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        width: 150, 
        backgroundColor: "#FFFFFF",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8, 
    },
    actionButton: {},
});
