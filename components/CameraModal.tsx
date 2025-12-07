import { COLORS } from "@/constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

interface CameraModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (uri: string) => void;
}
const CameraModal: React.FC<CameraModalProps> = (props) => {
    const { isVisible, onClose, onSubmit } = props;
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);

    if (!permission) {
        return null;
    }

    if (!permission.granted && isVisible) {
        return (
            <Modal
                visible={isVisible}
                onBlur={onClose}
                onDismiss={onClose}
                allowSwipeDismissal={true}
                style={styles.modal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={{ textAlign: "center", fontSize: 24 }}>
                        É necessário conceder permissões para usar a câmera
                    </Text>
                    <Button
                        onPress={requestPermission}
                        buttonStyle={{ margin: 20, width: "80%" }}
                    >
                        <Text
                            style={[{ color: COLORS.white, fontWeight: "500" }]}
                        >
                            Conceder Permissão
                        </Text>
                    </Button>
                </View>
            </Modal>
        );
    }

    const takePicture = async () => {
        // ⚠️ GARANTIR que a referência existe antes de chamar a função
        if (!ref.current) {
            console.error("Camera reference is null/undefined.");
            // Pode ser útil chamar onClose() aqui para fechar o modal
            // e evitar que o usuário tente novamente sem a câmera estar pronta.
            onClose();
            return;
        }

        try {
            // Agora podemos usar a referência sem o optional chaining,
            // mas é sempre bom envolver em try/catch para capturar erros de hardware/permissão.
            const photo = await ref.current.takePictureAsync({
                quality: 0.5, // Reduz a qualidade do JPEG para 50%
                base64: false,
            });

            if (photo?.uri) {
                // 💡 Sequência de execução crucial:
                // 1. Envie a URI para a tela principal (onSubmit)
                onClose();
                onSubmit(photo.uri);

                // 2. Feche o modal DEPOIS de enviar os dados.
                // Se o crash estiver acontecendo por causa de race condition
                // ou desalocação, manter esta ordem é vital.
            } else {
                console.warn("Photo captured, but URI is missing or invalid.");
                // Não faça nada ou exiba uma mensagem de erro leve.
            }
        } catch (error) {
            console.error("Error taking picture:", error);
            // Tratar o erro (exibir mensagem ao usuário e fechar o modal)
            onClose();
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onSubmit(result.assets[0].uri);
            onClose();
        }
    };

    const renderCamera = () => {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    ref={ref}
                    mute={false}
                    responsiveOrientationWhenOrientationLocked
                />

                <Ionicons
                    name="close"
                    size={30}
                    color="#fff"
                    style={{ position: "absolute", top: 50, left: 20 }}
                    onPress={onClose}
                />

                <View style={styles.shutterContainer}>
                    <Pressable onPress={pickImage}>
                        <AntDesign name="picture" size={32} color="white" />
                    </Pressable>
                    <Pressable onPress={takePicture}>
                        {({ pressed }) => (
                            <View
                                style={[
                                    styles.shutterBtn,
                                    {
                                        opacity: pressed ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.shutterBtnInner,
                                        {
                                            backgroundColor: "white",
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={isVisible}
            onBlur={onClose}
            onDismiss={onClose}
            allowSwipeDismissal={true}
            style={styles.modal}
            animationType="slide"
        >
            {renderCamera()}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    cameraContainer: StyleSheet.absoluteFillObject,
    camera: StyleSheet.absoluteFillObject,
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "50%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 50,
        gap: 75,
    },
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
});

export default CameraModal;
