import React from "react";
import { SafeAreaView, TouchableOpacity, Text, Alert } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";
import * as LocalAuthentication from "expo-local-authentication";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "HomeScreen"> {}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleAuthentication = async () => {
    try {
      const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
      if (!isBiometricSupported) {
        Alert.alert("Erro", "Autenticação biométrica não suportada neste dispositivo.");
        return;
      }

      // Verifica se há biometria cadastrada
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isBiometricEnrolled) {
        Alert.alert("Erro", "Nenhuma biometria cadastrada no dispositivo.");
        return;
      }

      // Solicita a autenticação biométrica
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticar para continuar",
        fallbackLabel: "Usar senha",
      });

      if (result.success) {
        navigation.navigate("ContactScreen");
      } else {
        Alert.alert("Autenticação Falhou", "Não foi possível autenticar.");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      Alert.alert("Erro", "Ocorreu um erro durante a autenticação.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bem Vindo ao App!</Text>
      <TouchableOpacity style={styles.Button} onPress={handleAuthentication}>
        <Text style={styles.ButtonText}>Iniciar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
