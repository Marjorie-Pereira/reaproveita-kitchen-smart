import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

const Inventory = () => {
  return (
    <View>
      <Text>Inventory</Text>
      <Button
        title="outra pagina"
        onPress={() => router.navigate("/main/inventory/outrapagina")}
      />
    </View>
  );
};

export default Inventory;
