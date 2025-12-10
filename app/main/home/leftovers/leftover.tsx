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
  const [leftoverPortions, setLeftoverPortions] = useState<number>(0); 
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

    setLeftoverPortions(loadedPortions);

    portionsRef.current = loadedPortions;
  }

  async function updateLeftoverPortions() {
    if (!meal?.id) {
      return;
    }
    const portionsToSave = portionsRef.current ?? 0; 


    const { error } = await supabase
      .from("Refeicoes")
      .update({ porcoes: portionsToSave })
      .eq("id", meal.id); 
    if (error) throw new Error(error.message);
  }

  useFocusEffect(
    useCallback(() => {
      fetchLeftoverMeal(Number(mealId));

      return () => {
      };
    }, [])
  );

 
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxWidth: 400, 
    alignSelf: "center", 
    width: "100%",
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
  portionsContainer: {
    marginBottom: 20,
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
