import { COLORS } from "@/constants/theme";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type floatingActionButtonProps = {
  isExpanded: SharedValue<boolean>;
  index: number;
  buttonLetter: string;
  icon?: any;
  onPress: (event: GestureResponderEvent) => void;
};

const FloatingActionButton = ({
  isExpanded,
  index,
  buttonLetter,
  onPress,
  icon,
}: floatingActionButtonProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0.0001;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      style={[animatedStyles, styles.shadow, styles.button]}
      onPress={onPress}
    >
      {icon && icon}
      <Animated.Text style={styles.content}>{buttonLetter}</Animated.Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  content: {
    color: "#4A7D47",
    fontWeight: 500,
    textAlign: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    minWidth: 100,
    width: "100%",
    height: 50,
    padding: 4,
    backgroundColor: COLORS.white,
    position: "absolute",
    bottom: 80,
    right: 1,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    flexDirection: "row",
    elevation: 1,
  },
});

export default FloatingActionButton;
