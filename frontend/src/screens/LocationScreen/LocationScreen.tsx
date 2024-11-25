import React, { useContext, useState } from "react";
import { View, Alert } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";
import { ContactContext } from "../../contexts/ContactContext";
import * as Location from "expo-location";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "LocationScreen"> {}

const LocationScreen: React.FC<Props> = ({ route }) => {
  const { id, latitude, longitude } = route.params; // Recebendo as coordenadas do contato
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("LocationScreen deve ser usada dentro de um ContactProvider.");
  }

  const { contacts, updateContact } = context;

  const [markerPosition, setMarkerPosition] = useState({
    latitude,
    longitude,
  });

  // Função chamada ao clicar no mapa
  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });

    try {
      // Obter o endereço com base nas novas coordenadas
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const updatedAddress = `${location.street || ""}, ${location.name || ""} ${
        location.city || ""
      }, ${location.region || ""}, ${location.postalCode || ""}, ${
        location.country || ""
      }`;

      // Obter os dados do contato pelo ID
      const contactToUpdate = contacts.find((contact) => contact.id === id);

      if (!contactToUpdate) {
        Alert.alert("Erro", "Contato não encontrado para atualização.");
        return;
      }

      // Atualizar o contato com o novo endereço e coordenadas
      await updateContact({
        ...contactToUpdate,
        latitude,
        longitude,
        address: updatedAddress, // Atualiza o endereço
      });

      console.log("Contato atualizado no backend:", {
        ...contactToUpdate,
        latitude,
        longitude,
        address: updatedAddress,
      });

      Alert.alert("Sucesso", "Localização atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar localização:", error);
      Alert.alert("Erro", "Não foi possível atualizar a localização.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={handleMapPress} // Captura o clique no mapa
      >
        <Marker
          coordinate={markerPosition}
          title="Localização do Contato"
        />
      </MapView>
    </View>
  );
};

export default LocationScreen;
