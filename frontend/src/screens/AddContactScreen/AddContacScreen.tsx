import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, TextInput, Alert } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";
import * as Location from "expo-location";
import { addContact } from "../../services/LocationContactService";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "AddContactScreen"> {}

const AddContactScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [locationDetails, setLocationDetails] = useState<{
    street?: string;
    name?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }>({});

  // Função para tratar o clique no mapa
  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    console.log("Latitude clicada:", latitude);
    console.log("Longitude clicada:", longitude);

    try {
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (location) {
        console.log("Detalhes da localização:", location);

        setLocationDetails({
          street: location.street || undefined,
          name: location.name || undefined, // Nome ou número do imóvel
          city: location.city || undefined,
          region: location.region || undefined,
          postalCode: location.postalCode || undefined,
          country: location.country || undefined,
          latitude,
          longitude,
        });

        // Incluir `name` no endereço completo
        const fullAddress = `${location.street || ""}, ${location.name || ""} ${
          location.city || ""
        }, ${location.region || ""}, ${location.postalCode || ""}, ${
          location.country || ""
        }`;
        setAddress(fullAddress);
      } else {
        Alert.alert("Erro", "Não foi possível obter o endereço.");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      Alert.alert("Erro", "Falha ao buscar o endereço.");
    }
  };

  // Função para salvar o contato
  const handleAddContact = async () => {
    if (
      !name ||
      !address ||
      !locationDetails.latitude ||
      !locationDetails.longitude
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const newContact = {
        name,
        address,
        street: locationDetails.street || "",
        houseNumber: locationDetails.name || "", // Adicione o número do imóvel
        city: locationDetails.city || "",
        region: locationDetails.region || "",
        postalCode: locationDetails.postalCode || "",
        country: locationDetails.country || "",
        latitude: locationDetails.latitude,
        longitude: locationDetails.longitude,
      };

      console.log("Enviando contato:", newContact);

      const response = await addContact(newContact);
      console.log("Resposta do backend:", response);

      Alert.alert("Sucesso", "Contato salvo com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      Alert.alert("Erro", "Não foi possível salvar o contato.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formcontainer}>
        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Endereço"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <Text style={styles.addressText}>Endereço: {address}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleAddContact}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.2953,
          longitude: -45.9669,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {locationDetails.latitude !== undefined &&
          locationDetails.longitude !== undefined && (
            <Marker
              coordinate={{
                latitude: locationDetails.latitude!,
                longitude: locationDetails.longitude!,
              }}
              title={`${locationDetails.name || ""} ${
                locationDetails.street || ""
              }`}
              description={`${locationDetails.city || ""}, ${
                locationDetails.region || ""
              }`}
            />
          )}
      </MapView>
    </View>
  );
};

export default AddContactScreen;
