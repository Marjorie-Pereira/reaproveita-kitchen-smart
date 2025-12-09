import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nameRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [eyeIcon, setEyeIcon] = useState("hide");

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert("Por favor preencha todos os campos");
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: name,
                    username: email.split("@")[0],
                    email,
                },
            },
        });
        setLoading(false);

        if (error) {
            switch (error.code) {
                case "weak_password":
                    Alert.alert(
                        "Erro Cadastro",
                        "Senha deve ter pelo menos 6 caracteres"
                    );
                    break;
                case "validation_failed":
                    Alert.alert("Erro Cadastro", "E-mail Inválido");
                    break;
                case "user_already_exists":
                    Alert.alert("Erro Cadastro", "O email já possui cadastro");
                    break;
                default:
                    Alert.alert("Erro Cadastro", "Erro inesperado");
                    break;
            }
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
                        <Text style={styles.welcomeText}>
                            Olá, seja bem-vindo!
                        </Text>
                    </View>

                    {/* form */}
                    <View style={styles.form as StyleProp<ViewStyle>}>
                        <Text style={{ fontSize: 20 }}>
                            Por favor insira suas credenciais
                        </Text>

                        <Input
                            placeholder="Seu nome aqui"
                            icon={
                                <Feather
                                    name="user"
                                    size={24}
                                    color="#4A7D47"
                                />
                            }
                            onChangeText={(value: string) =>
                                (nameRef.current = value)
                            }
                        />

                        <Input
                            placeholder="Endereço de email"
                            onChangeText={(value: string) =>
                                (emailRef.current = value)
                            }
                        />
                        <Input
                            placeholder="Senha"
                            icon={
                                eyeIcon === "show" ? (
                                    <FontAwesome
                                        name="eye"
                                        size={24}
                                        color="#4A7D47"
                                    />
                                ) : (
                                    <FontAwesome
                                        name="eye-slash"
                                        size={24}
                                        color="#4A7D47"
                                    />
                                )
                            }
                            onChangeText={(value: string) =>
                                (passwordRef.current = value)
                            }
                            togglePassword={() => {
                                setEyeIcon(
                                    eyeIcon === "hide" ? "show" : "hide"
                                );
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
                                Cadastrar
                            </Text>
                        </Button>
                    </View>
                    {/* footer */}
                    <View style={styles.footer as StyleProp<ViewStyle>}>
                        <Text style={styles.footerText}>
                            Já possui uma conta?{" "}
                        </Text>
                        <Pressable onPress={() => router.push("./login")}>
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
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default SignUp;

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
        marginTop: 10,
    },
});
