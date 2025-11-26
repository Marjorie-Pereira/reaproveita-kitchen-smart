import { baseUrl, queryFields } from "@/constants/openFoodFactsApi";
import { COLORS } from "@/constants/theme";
import { userAgent } from "@/constants/userAgent";
import { productType, responseType } from "@/types/openFoodApiResponse";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

interface ScannerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onScan: (scannedProduct: productType) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({
  isVisible,
  onClose,
  onScan,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    setScanned(false);
  }, [isVisible]);

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
      onScan(result.product);
    }
  };

  let modalContent = undefined;

  if (hasPermission === null) {
    modalContent = <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    modalContent = <Text>No access to camera</Text>;
  }

  return (
    <>
      <Modal
        visible={isVisible}
        onBlur={onClose}
        onDismiss={onClose}
        allowSwipeDismissal={true}
        style={styles.modal}
        animationType="slide"
      >
        {modalContent ? (
          modalContent
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>Escanear código de barras</Text>
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
            <Button
              onPress={() => onClose()}
              hasShadow={false}
              buttonStyle={styles.cancelButton}
            >
              <Ionicons name="close" size={24} color={COLORS.primary} />
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "500",
                }}
              >
                Cancelar
              </Text>
            </Button>
          </View>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
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

  cancelButton: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: COLORS.primary,
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
});

export default ScannerModal;
