import { supabase } from "@/lib/supabase";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import DrawerButton from "./DrawerButton";

const DrawerContent = (drawerProps: DrawerContentComponentProps) => {
  const onLogout = async () => {
    Alert.alert("Encerrar Sessão", "Tem certeza que deseja sair?", [
      {
        text: "Sim",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert("Logout", error.message);
          }
        },
      },
      { text: "Cancelar", onPress: () => null },
    ]);
  };
  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 10 }}>
      {drawerProps.state.routes.map((route, index) => {
        const options = drawerProps.descriptors[route.key].options;
        const isFocused = drawerProps.state.index === index;

        const onPress = () => {
          const event = drawerProps.navigation.emit({
            type: "drawerItemPress",
            canPreventDefault: true,
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            drawerProps.navigation.navigate(route.name, route.params);
          }
        };

        return (
          <DrawerButton
            title={options.title}
            key={index}
            onPress={onPress}
            isFocused={isFocused}
          />
        );
      })}
      <DrawerButton title="Encerrar Sessão" onPress={onLogout} />
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({});
