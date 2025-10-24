import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View
      style={styles.container}
    >
      <Text>Bem-vindo à tela Welcome!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});
