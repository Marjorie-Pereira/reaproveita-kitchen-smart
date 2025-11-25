import Button from "@/components/Button";
import EditUserInfoModal, { userData } from "@/components/EditUserInfoModal";
import Input from "@/components/Input";
import RestrictionChip from "@/components/RestrictionChip";
import { fallbackImg } from "@/constants/fallbackImage";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Entypo, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<userData | null>(null);
  const [foodRestrictions, setFoodRestrictions] = useState([
    "Lactose",
    "Glúten",
    "Amendoim",
    "Pimenta",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removeRestriction = (name: string) => {
    if (foodRestrictions.includes(name)) {
      const index = foodRestrictions.indexOf(name);
      const newValue = [...foodRestrictions];
      newValue.splice(index, 1);

      setFoodRestrictions(newValue);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id);
    if (error) throw new Error(error.message);

    setUserData(data[0]);
  };

  useEffect(() => {
    console.log("user data effect");
  }, [userData, foodRestrictions]);

  useEffect(() => {
    console.log("fecthing again");
    fetchUserData();
  }, [user]);

  const updateUserData = async (id: string, newData: userData) => {
    const { error } = await supabase
      .from("users")
      .update({
        first_name: newData.first_name,
        profile_pic: newData.profile_pic,
        phone: newData.phone,
      })
      .eq("id", id);

    if (error) {
      Alert.alert("Erro ao atualizar informações");
      console.error(error);
      return;
    } else {
      Alert.alert("Alterações salvas!");
      fetchUserData();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();

      return () => {};
    }, [])
  );

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileTopSection}>
            <Image
              resizeMode="cover"
              source={{
                uri: userData?.profile_pic ?? fallbackImg,
              }}
              style={{
                width: 150,
                height: 150,
                aspectRatio: 1,
                marginBottom: 10,
                borderRadius: 100,
              }}
            />
            <Text style={styles.userName}>{userData?.first_name}</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfo}>
              <Feather name="mail" size={20} color={COLORS.slate600} />
              <Text style={styles.userInfoText}>{userData?.email}</Text>
            </View>
            <View style={styles.userInfo}>
              <Feather name="phone" size={20} color={COLORS.slate600} />
              <Text style={styles.userInfoText}>
                {userData?.phone ?? "Nenhum número cadastrado"}
              </Text>
            </View>
          </View>

          {/* restrições */}
          <View
            style={{
              ...styles.profileTopSection,
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text style={[styles.restrictionsTitle, { textAlign: "left" }]}>
                Restrições Alimentares
              </Text>
              <Text style={{ color: COLORS.slate600 }}>
                Gerencie suas restrições alimentares
              </Text>
            </View>
            <View style={styles.selectedRestrictions}>
              {foodRestrictions.map((item, index) => (
                <RestrictionChip
                  text={item}
                  key={index}
                  onRemove={() => removeRestriction(item)}
                />
              ))}
            </View>
          </View>
          <View style={styles.newRestrictionInput}>
            <Input
              placeholder="Adicionar nova restrição"
              containerStyles={{
                flex: 1,
              }}
            />
            <Button
              buttonStyle={{
                width: 50,
                height: 50,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="plus" size={20} color={COLORS.white} />
            </Button>
          </View>

          <Button
            buttonStyle={{ marginTop: 20 }}
            onPress={() => setIsModalOpen(true)}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>
              Editar Informações
            </Text>
          </Button>
        </View>
      </ScrollView>
      <EditUserInfoModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(userId, newValue) => {
          updateUserData(userId, newValue);
        }}
        userData={userData!}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderColor: COLORS.slate200,
    borderRadius: 15,
    padding: 20,
  },
  profileTopSection: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
    width: "100%",
    alignItems: "center",
    paddingVertical: 18,
    gap: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfoContainer: {
    marginVertical: 20,
    gap: 20,
  },
  userInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  userInfoText: {
    color: COLORS.slate600,
    fontWeight: "400",
  },
  restrictionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
  },
  selectedRestrictions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  newRestrictionInput: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
});

export default Index;
