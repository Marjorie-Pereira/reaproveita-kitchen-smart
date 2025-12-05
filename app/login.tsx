import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [eyeIcon, setEyeIcon] = useState("hide");

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Por favor preencha todos os campos");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Login", error.message);
      console.error(error);

      return;
    }
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          padding: 20,
          gap: 20,
        }}
      >
        <View>
          {/* title */}
          <View>
            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          </View>

          {/* form */}
          <View style={styles.form as StyleProp<ViewStyle>}>
            <Text style={{ fontSize: 20 }}>
              Por favor insira suas credenciais
            </Text>

            <Input
              placeholder="Endereço de email"
              onChangeText={(value: string) => (emailRef.current = value)}
            />
            <Input
              placeholder="Senha"
              icon={
                eyeIcon === "show" ? (
                  <FontAwesome name="eye" size={24} color="#4A7D47" />
                ) : (
                  <FontAwesome name="eye-slash" size={24} color="#4A7D47" />
                )
              }
              onChangeText={(value: string) => (passwordRef.current = value)}
              togglePassword={() => {
                setEyeIcon(eyeIcon === "hide" ? "show" : "hide");
              }}
              type="password"
              secureTextEntry={eyeIcon === "hide" ? true : false}
            />
            {/* <Text style={styles.forgotPassword}>Esqueceu a senha?</Text> */}
            <Button
              loading={loading}
              onPress={onSubmit}
              buttonStyle={{ marginBottom: 5 }}
            >
              <Text style={{ color: "white", fontWeight: "500" }}>
                Entrar
              </Text>
            </Button>
          </View>
          {/* footer */}
          <View style={styles.footer as StyleProp<ViewStyle>}>
            <Text style={styles.footerText as StyleProp<TextStyle>}>
              Não possui uma conta?{" "}
            </Text>
            <Pressable onPress={() => router.push("./signUp")}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: "#AF387C",
                    textDecorationLine: "underline",
                    fontFamily: "Lato_400Regular",
                    textAlign: "center",
                    fontSize: 16,
                  },
                ]}
              >
                Cadastre-se
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 30,
    color: "#000",
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
  },
});
