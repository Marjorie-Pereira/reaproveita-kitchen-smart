import { COLORS, globalStyles } from "@/constants/theme";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "./Input";

interface userData {
  name: string;
  email: string;
  phone?: string;
}

interface EditUserInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
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
  const [userName, setUserName] = useState(userData.name);
  const [userEmail, setUserEmail] = useState(userData.email);
  const [userPhone, setUserPhone] = useState(userData.phone);

  return (
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
          <View style={{ gap: 10, marginBottom: 40 }}>
            <Text style={modalStyles.itemName}>Email</Text>
            <Input
              placeholder="Email"
              value={userEmail}
              onChangeText={setUserEmail}
            />
          </View>
          <View style={{ gap: 10, marginBottom: 40 }}>
            <Text style={modalStyles.itemName}>Telefone</Text>
            <Input
              placeholder="Número de telefone"
              value={userPhone}
              onChangeText={setUserPhone}
              keyboardType="numeric"
            />
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
            onPress={onSubmit}
            style={[globalStyles.primaryButton, { flex: 1 }]}
            textStyle={globalStyles.primaryButtonText}
          />
        </View>
      </View>
    </Modal>
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

export default EditUserInfoModal;
