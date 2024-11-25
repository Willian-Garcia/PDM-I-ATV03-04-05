import React, { useContext, useState, useEffect } from "react";
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
  const { id, latitude, longitude } = route.params;
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("LocationScreen deve ser usada dentro de um ContactProvider.");
  }

  const { contacts, updateContact } = context;

  const [markerPosition, setMarkerPosition] = useState({
    latitude,
    longitude,
  });

  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "A aplicação precisa de acesso à localização para funcionar corretamente."
        );
        setLocationPermission(false);
      } else {
        setLocationPermission(true);
      }
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = async (event: MapPressEvent) => {
    if (!locationPermission) {
      Alert.alert("Permissão Negada", "Permissão de localização necessária.");
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });

    try {
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const updatedAddress = `${location.street || ""}, ${location.name || ""} ${
        location.city || location.subregion || ""
      }, ${location.region || ""}, ${location.postalCode || ""}, ${
        location.country || ""
      }`;

      const contactToUpdate = contacts.find((contact) => contact.id === id);

      if (!contactToUpdate) {
        Alert.alert("Erro", "Contato não encontrado para atualização.");
        return;
      }

      await updateContact({
        ...contactToUpdate,
        latitude,
        longitude,
        address: updatedAddress,
      });

      Alert.alert(
        "Sucesso! Localização Atualizada",
        `O novo endereço é:\n${updatedAddress}`
      );
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      Alert.alert("Erro", "Falha ao buscar o endereço.");
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
        onPress={handleMapPress}
      >
        <Marker coordinate={markerPosition} title="Localização do Contato" />
      </MapView>
    </View>
  );
};

export default LocationScreen;
