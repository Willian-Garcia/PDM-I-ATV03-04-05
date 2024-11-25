import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";

interface Props extends NativeStackScreenProps<RootStackParamList, "HomeScreen"> {}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bem Vindo ao App!</Text>
      <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("ContactScreen")}>
        <Text style={styles.ButtonText}>Iniciar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;