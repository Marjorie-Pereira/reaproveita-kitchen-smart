import Button from "@/components/Button";
import { baseUrl, queryFields } from "@/constants/openFoodFactsApi";
import { userAgent } from "@/constants/userAgent";
import { responseType } from "@/types/openFoodApiResponse";
import { Camera, CameraView } from "expo-camera";
import { ExternalPathString, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BarCodeScanner(props: { backToPath?: string }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { backToPath } = props;
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
     
      router.push({
        pathname:
          (backToPath as ExternalPathString) || "/main/home/forms/newFoodItem",
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
        <Text style={{marginBottom: 20, fontSize: 20, textAlign:'center'}}>
            Aponte a câmera para o código de barras
        </Text>
      <View style={styles.barcodebox}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <Button
          onPress={() => setScanned(false)}
          buttonStyle={{
            padding: 10,
            marginTop: 20,
            margin: 20,
          }}
        >
          <Text style={{ color: "#fff" }}>Escanear Novamente</Text>
        </Button>
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
    padding: 20,
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
