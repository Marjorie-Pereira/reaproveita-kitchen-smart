import { GestureResponderEvent } from "react-native";

export type buttonActionsObject = {
  label: string;
  icon: any;
  onPress: (event: GestureResponderEvent) => void;
};