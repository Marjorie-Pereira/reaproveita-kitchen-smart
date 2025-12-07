import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#5C9C59",
                },
                headerTitleStyle: {
                    fontWeight: "regular",
                    color: "white",
                },
                headerTintColor: "white",
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Sobras de refeições",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="leftover"
                options={{
                    title: "Detalhes da sobra",
                }}
            />
            <Stack.Screen
                name="recipesLeftovers"
                options={{
                    title: "Receitas para Reaproveitar",
                }}
            />
        </Stack>
    );
};

export default _layout;
