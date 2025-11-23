import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import BarCodeScanner from "../home/forms/barCodeScanner";

const scanBarCode = () => {
  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      console.log(params);
      return () => {
        console.log("saiu");
      };
    }, [])
  );
  return <BarCodeScanner backToPath="/main/shoppingList" />;
};

export default scanBarCode;
