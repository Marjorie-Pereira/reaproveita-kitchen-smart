import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { mealObject } from "@/types/mealObject.type";
import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { formatDate } from "date-fns";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function MealViewScreen() {
  const { mealId } = useLocalSearchParams();

  const [keyboardAvoid, setKeyboardAvoid] = useState(false);

  const [reportedDate, setReportedDate] = useState<Date | null>();
  const router = useRouter();
  const height = useHeaderHeight();
  const [meal, setMeal] = useState<mealObject | undefined>();
  const [leftoverPortions, setLeftoverPortions] = useState<number>(0); // 💡 Comece com 0 (ou null, se preferir)
  const portionsRef = useRef(0); // 💡 Comec
  async function fetchLeftoverMeal(mealId: number) {
    const { data, error } = await supabase
      .from("Refeicoes")
      .select("*, ReceitasCompletas(receita, link_imagem)")
      .eq("id", mealId)
      .eq("tem_sobras", true)
      .single();
    if (error) throw new Error(error.message);

    const formattedDate = formatDate(data.data_sobras, "dd/MM/yyyy");

    const { ["ReceitasCompletas"]: recipeInfo, ...rest } = data;
    const leftoverMeal: mealObject = {
      ...rest,
      recipeInfo,
      data_sobras: formattedDate,
    };
    setMeal(leftoverMeal);

    const loadedPortions = leftoverMeal.porcoes ?? 0;

    // 1. Atualiza o estado (que o NumberRaiseInput está lendo)
    setLeftoverPortions(loadedPortions);

    // 2. ATUALIZA DIRETAMENTE A REF com o valor carregado
    portionsRef.current = loadedPortions;
  }

  async function updateLeftoverPortions() {
    if (!meal?.id) {
      return;
    }
    const portionsToSave = portionsRef.current ?? 0; // Garantia final de que é um número


    // A validação de null/undefined se torna redundante, pois já foi tratada
    // pelos hooks de estado/ref, garantindo um 0 ou o valor real.

    const { error } = await supabase
      .from("Refeicoes")
      // O valor final é garantidamente um número (0 ou > 0)
      .update({ porcoes: portionsToSave })
      .eq("id", meal.id); // Certifique-se de que meal.id é usado aqui

    if (error) throw new Error(error.message);
  }

  useFocusEffect(
    useCallback(() => {
      fetchLeftoverMeal(Number(mealId));

      return () => {
        // updateLeftoverPortions();
      };
    }, [])
  );

  // 2. Use useEffect para manter a Ref sempre atualizada
  // Este hook é disparado a cada mudança de estado, mas NÃO afeta o useFocusEffect
  useEffect(() => {
    portionsRef.current = leftoverPortions ?? 0;
  }, [leftoverPortions]);

  async function onDeleteLeftoverMeal(mealId: number) {
    if (!mealId) return;
    const { error } = await supabase
      .from("Refeicoes")
      .delete()
      .eq("id", mealId);
    if (error) throw new Error(error.message);
    Alert.alert("Sobra Deletada!");
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
              contentFit="cover"
              source={{
                uri:
                  meal?.recipeInfo?.link_imagem ??
                  "https://gnesjjmiiharouctxukk.supabase.co/storage/v1/object/public/app_bucket_public/placeholder.png",
              }}
              style={{
                width: "100%",
                aspectRatio: 1,
                marginBottom: 10,
                alignSelf: "center",
              }}
            />
            {/* Recipe Name */}
            <View style={styles.cardSection}>
              <Text style={styles.h2}>{meal?.recipeInfo?.receita}</Text>

              <View style={styles.detailsRow}>
                <Text style={styles.calendarText}>Data de Consumo: </Text>
                <View style={styles.calendarContainer}>
                  <Feather name="calendar" size={16} color="#4B5563" />
                  <Text>{meal?.data_sobras.toString()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardSectionOptions}>
              <View style={styles.cardSectionActions}>
                {/* <View style={styles.portionsContainer}>
                  <Text style={styles.h2}>Porções:</Text>
                  <NumberRaiseInput
                    initialValue={leftoverPortions!}
                    onChange={(val) => setLeftoverPortions(val)}
                  />
                </View> */}
                <Button
                  onPress={() => {
                    router.push({pathname: "/main/home/leftovers/recipesLeftovers", params: {leftoverId: mealId}});
                  }}
                  buttonStyle={styles.actionButton}
                  variant="primary"
                >
                  <Feather name="book-open" size={16} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Formas de Reaproveitar</Text>
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
                          onPress: () => onDeleteLeftoverMeal(meal?.id!),
                        },
                      ]
                    );
                  }}
                  buttonStyle={styles.actionButton}
                  variant="destructive"
                >
                  <Feather name="trash-2" size={16} color="#FFFFFF" />

                  <Text style={styles.buttonText}>Remover Sobra</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Stylesheet (Equivalent to Tailwind Classes) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxWidth: 400, // max-w-md
    alignSelf: "center", // mx-auto
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // shadow-sm
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    overflow: "hidden",
  },
  cardSection: {
    padding: 24, // p-6
    borderBottomWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  cardSectionOptions: {
    padding: 24, // p-6
    paddingVertical: 16,
    gap: 16, // space-y-4
  },
  cardSectionActions: {
    padding: 24, // p-6
    paddingTop: 8, // pt-2
    gap: 12, // space-y-3
  },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12, // mb-3
    color: "#1F2937", // gray-800
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // gap-3
    flexWrap: "wrap",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // gap-1.5
    color: "#4B5563", // text-gray-600
  },
  calendarText: {
    fontSize: 14, // text-sm
    color: "#4B5563",
  },

  timeInputContainer: {
    marginLeft: 32, // ml-7 equivalent (approx 28px)
    gap: 8, // space-y-2
  },
  timeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // gap-1.5
  },
  timeLabelText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
  },
  timeInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 150, // max-w-[150px]
    backgroundColor: "#FFFFFF",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8, // Space between icon and text
  },
  actionButton: {},
  portionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
