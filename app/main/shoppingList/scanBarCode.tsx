import { useLocalSearchParams } from "expo-router";
import React from "react";
import BarCodeScanner from "../home/forms/barCodeScanner";

const scanBarCode = () => {
  const params = useLocalSearchParams();

 
  return <BarCodeScanner backToPath="/main/shoppingList" />;
};

export default scanBarCode;
