import { buttonActionsObject } from "@/types/buttonActionsObject";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FloatingActionButton from "./FloatingActionButton";

type FloatingButtonProps = {
  actions: buttonActionsObject[];
};

const FloatingButton = ({ actions }: FloatingButtonProps) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });
  return (
    <View style={styles.buttonContainer}>
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.shadow, styles.button]}
      >
        <Animated.Text style={[plusIconStyle, styles.content]}>+</Animated.Text>
      </AnimatedPressable>
      {actions.map((a, index) => (
        <FloatingActionButton
          key={index}
          isExpanded={isExpanded}
          index={index}
          buttonLetter={a.label}
          onPress={a.onPress}
          icon={a.icon}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    right: 20,
    bottom: 20,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "#4A7D47",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    color: "#f8f9ff",
  },
});

export default FloatingButton;
