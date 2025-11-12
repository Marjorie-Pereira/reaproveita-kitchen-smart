import Button from "@/components/Button";
import { baseUrl, queryFields } from "@/constants/openFoodFactsApi";
import { userAgent } from "@/constants/userAgent";
import { responseType } from "@/types/openFoodApiResponse";
import { Camera, CameraView } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BarCodeScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  const handleBarcodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    const headers = new Headers();
    headers.append("User-Agent", userAgent);
    const response = await fetch(baseUrl + data + `?fields=${queryFields}`, {
      method: "GET",
      headers: headers,
    });
    const result: responseType = await response.json();

    if (result.status === 0) {
      alert(`Produto com código ${data} não encontrado.`);
    } else {
      console.log("fetch", result);
      router.push({
        pathname: "/main/home/forms/newFoodItem",
        params: {
          scannedProduct: JSON.stringify(result.product),
        },
      });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <Button
          title={"Escanear Novamente"}
          onPress={() => setScanned(false)}
          buttonStyle={{
            padding: 10,
            marginTop: 20,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
});
