import { COLORS } from "@/constants/theme";
import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface DrawerButtonProps extends PressableProps {
  title?: string;
  isFocused?: boolean;
}
const DrawerButton = ({
  title = "",
  isFocused = false,
  ...rest
}: DrawerButtonProps) => {
  return (
    <Pressable
      {...rest}
      style={[
        {
          marginVertical: 5,
          padding: 20,
        },
        isFocused && {
          backgroundColor: COLORS.primaryLight,
          borderRadius: 100,
        },
      ]}
    >
      <Text
        style={[
          { fontWeight: "500", color: COLORS.label },
          isFocused && { color: COLORS.primary },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default DrawerButton;
