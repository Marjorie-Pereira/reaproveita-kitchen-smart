import { COLORS, globalStyles } from "@/constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CameraModal from "./CameraModal";
import Input from "./Input";

export interface userData {
  id: string;
  first_name: string;
  email?: string;
  phone?: string;
  profile_pic?: string;
}

interface EditUserInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (userId: string, newValue: userData) => void;
  userData: userData;
}

const Button = ({
  onPress,
  style,
  textStyle,
  title,
  disabled = false,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[globalStyles.buttonBase, style, disabled && { opacity: 0.5 }]}
    disabled={disabled}
  >
    <Text style={textStyle}>{title}</Text>
  </TouchableOpacity>
);

const EditUserInfoModal: React.FC<EditUserInfoModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  userData,
}) => {
  const [userName, setUserName] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();
  const [userPhone, setUserPhone] = useState<string | undefined>();
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const userId = userData?.id;

  useEffect(() => {
    if (isVisible) {
      setUserName(userData?.first_name);
      setUserEmail(userData?.email);
      setUserPhone(userData?.phone);
      setImageUri(userData?.profile_pic);
    }
  }, [isVisible]);

  useEffect(() => console.log(userData), [userData]);

  const renderPicture = (uri: string) => {
    console.log("render picture");
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={isVisible}
        onBlur={onClose}
        onDismiss={onClose}
        allowSwipeDismissal={true}
        style={modalStyles.modal}
        animationType="slide"
      >
        <View style={[globalStyles.modalView, { paddingTop: 60 }]}>
          {/* Modal Content */}
          <ScrollView style={modalStyles.content}>
            <Text style={modalStyles.formTitle}>Editar Informações</Text>
            <View style={{ gap: 10, marginBottom: 40 }}>
              <Text style={modalStyles.itemName}>Nome</Text>
              <Input
                placeholder="Nome"
                value={userName}
                onChangeText={setUserName}
              />
            </View>
            {/* <View style={{ gap: 10, marginBottom: 40 }}>
              <Text style={modalStyles.itemName}>Email</Text>
              <Input
                placeholder="Email"
                value={userEmail}
                onChangeText={setUserEmail}
                editable={false}
              />
            </View> */}
            <View style={{ gap: 10, marginBottom: 40 }}>
              <Text style={modalStyles.itemName}>Telefone</Text>
              <Input
                placeholder="Número de telefone"
                value={userPhone}
                onChangeText={setUserPhone}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: 10,
                }}
                onPress={() => {
                  setIsCameraOpen(true);
                }}
              >
                <Text>Escolher imagem...</Text>
                <FontAwesome name="camera" size={24} color={COLORS.label} />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              {imageUri && renderPicture(imageUri)}
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={globalStyles.modalFooter}>
            <Button
              title="Cancelar"
              onPress={onClose}
              style={[globalStyles.outlineButton, { flex: 1 }]}
              textStyle={globalStyles.outlineButtonText}
            />
            <Button
              title={`Salvar Alterações`}
              onPress={() => {
                onSubmit(userId, {
                  id: "",
                  first_name: userName as string,
                  phone: userPhone,
                  profile_pic: imageUri,
                });
                onClose();
              }}
              style={[globalStyles.primaryButton, { flex: 1 }]}
              textStyle={globalStyles.primaryButtonText}
            />
          </View>
        </View>
      </Modal>
      <CameraModal
        isVisible={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onSubmit={(uri) => setImageUri(uri)}
      />
    </>
  );
};

const modalStyles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },

  content: {
    flexGrow: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 23,
    color: COLORS.slate900,
    fontWeight: "600",
    marginBottom: 50,
  },

  itemName: {
    color: COLORS.slate900,
    fontSize: 16,
    fontWeight: "500",
  },
  itemStock: {
    fontSize: 14,
    color: COLORS.slate500,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 52,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditUserInfoModal;
