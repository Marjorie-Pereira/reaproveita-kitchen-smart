import Button from "@/components/Button";
import Input from "@/components/Input";
import RestrictionChip from "@/components/RestrictionChip";
import { fallbackImg } from "@/constants/fallbackImage";
import { COLORS } from "@/constants/theme";
import { Entypo, Feather } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const tulla = "https://statics.otvfoco.com.br/2019/03/tulla-luana-1.jpg";
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileTopSection}>
          <Image
            resizeMode="cover"
            source={{
              uri: tulla ?? fallbackImg,
            }}
            style={{
              width: 150,
              height: 150,
              aspectRatio: 1,
              marginBottom: 10,
              borderRadius: 100,
            }}
          />
          <Text style={styles.userName}>Webdiva Tulla Luana</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfo}>
            <Feather name="mail" size={20} color={COLORS.slate600} />
            <Text style={styles.userInfoText}>tulla@diva.com</Text>
          </View>
          <View style={styles.userInfo}>
            <Feather name="phone" size={20} color={COLORS.slate600} />
            <Text style={styles.userInfoText}>(11) 998998989</Text>
          </View>
        </View>

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
            <RestrictionChip text="Lactose" />
            <RestrictionChip text="Glúten" />
            <RestrictionChip text="Amendoim" />
            <RestrictionChip text="Banana" />
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
      </View>
    </ScrollView>
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
