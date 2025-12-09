import { Stack } from 'expo-router'
import React from 'react'

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
                name="recipeView"
                options={{
                    title: "Informações da Receita",
                    headerShown: true,
                }}
            />
           
        </Stack>
  )
}

export default _layout