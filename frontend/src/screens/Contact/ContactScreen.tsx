import React, { useContext, useEffect } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ContactContext } from "../../contexts/ContactContext"; // Importa o contexto
import { IContact } from "src/types/IContact";

interface Props extends NativeStackScreenProps<RootStackParamList, "ContactScreen"> {}

const ContactScreen: React.FC<Props> = ({ navigation }) => {
  // Usa o contexto para acessar os contatos e a função de carregamento
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("ContactScreen deve ser usado dentro de um ContactProvider.");
  }

  const { contacts, loadContacts } = context;

  // Carrega os contatos ao montar o componente
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Função para renderizar cada contato
  const renderContact = ({ item }: { item: IContact }) => (
    <TouchableOpacity
      style={styles.contactcontainer}
      onPress={() =>
        navigation.navigate("LocationScreen", {
          latitude: item.latitude,
          longitude: item.longitude,
        })
      }
    >
      <Text style={styles.contacttext}>{item.name}</Text>
      <Text style={styles.contacttext}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()} // Certifique-se de que `id` seja uma string ou número
        renderItem={renderContact}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddContactScreen")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;
