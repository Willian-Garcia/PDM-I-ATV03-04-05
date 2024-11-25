import React, { useContext, useEffect } from "react";
import { FlatList, TouchableOpacity, View, Text, Alert } from "react-native";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ContactContext } from "../../contexts/ContactContext";
import { IContact } from "src/types/IContact";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "ContactScreen"> {}

const ContactScreen: React.FC<Props> = ({ navigation }) => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error(
      "ContactScreen deve ser usado dentro de um ContactProvider."
    );
  }

  const { contacts, loadContacts, deleteContact } = context;

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Excluir Contato",
      "Tem certeza que deseja excluir este contato?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteContact(id);
          },
        },
      ]
    );
  };

  const renderContact = ({ item }: { item: IContact }) => (
    <TouchableOpacity
      style={styles.contactcontainer}
      onPress={() =>
        navigation.navigate("LocationScreen", {
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
        })
      }
    >
      <View style={styles.closecontainer}>
        <Text style={styles.contacttext}>{item.name}</Text>
        <TouchableOpacity
          style={{ marginBottom: 1 }}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="close-circle" size={28} color={"red"} />
        </TouchableOpacity>
      </View>
      <Text style={styles.contacttext}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
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
