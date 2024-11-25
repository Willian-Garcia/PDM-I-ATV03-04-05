import React, { useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
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
    houseNumber?: string; // Usado para armazenar o número do local
    city?: string;
    subregion?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>({
    latitude: -23.2953,
    longitude: -45.9669,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef<MapView>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "A aplicação precisa de acesso à localização para funcionar corretamente."
        );
      }
      setLocationPermission(status === "granted");
    };

    requestLocationPermission();
  }, []);

  const handleAddressChange = (input: string) => {
    setAddress(input);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (!input.trim()) {
        setLocationDetails((prev) => ({
          ...prev,
          street: "",
          houseNumber: "",
          city: "",
          subregion: "",
          region: "",
          postalCode: "",
          country: "",
        }));
        return;
      }

      try {
        const location = await Location.geocodeAsync(input);

        if (location.length > 0) {
          const { latitude, longitude } = location[0];

          const [locationDetails] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (locationDetails) {
            const fullAddress = `${locationDetails.street || ""}, ${
              locationDetails.name || ""
            }, ${locationDetails.city || locationDetails.subregion || ""}, ${
              locationDetails.region || ""
            }, ${locationDetails.postalCode || ""}, ${
              locationDetails.country || ""
            }`;

            setLocationDetails({
              street: locationDetails.street || "",
              houseNumber: locationDetails.name || "", // Número do imóvel
              city: locationDetails.city || locationDetails.subregion || "",
              subregion: locationDetails.subregion || "",
              region: locationDetails.region || "",
              postalCode: locationDetails.postalCode || "",
              country: locationDetails.country || "",
              latitude,
              longitude,
            });

            setAddress(fullAddress);

            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000
              );
            }
          } else {
            Alert.alert("Erro", "Não foi possível obter o endereço.");
          }
        } else {
          Alert.alert("Erro", "Endereço não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao processar o endereço:", error);
        Alert.alert("Erro", "Não foi possível buscar o endereço.");
      }
    }, 5000); // Debounce de 5 segundos
  };

  const handleMapPress = async (event: MapPressEvent) => {
    if (!locationPermission) {
      Alert.alert("Permissão Negada", "Permissão de localização necessária.");
      return;
    }

    const { latitude, longitude } = event.nativeEvent.coordinate;

    try {
      const [location] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (location) {
        setLocationDetails({
          street: location.street || "",
          houseNumber: location.name || "", // Número do imóvel
          city: location.city || location.subregion || "",
          subregion: location.subregion || "",
          region: location.region || "",
          postalCode: location.postalCode || "",
          country: location.country || "",
          latitude,
          longitude,
        });

        const fullAddress = `${location.street || ""}, ${location.name || ""} ${
          location.city || location.subregion || ""
        }, ${location.region || ""}, ${location.postalCode || ""}, ${
          location.country || ""
        }`;
        setAddress(fullAddress);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }
      } else {
        Alert.alert("Erro", "Não foi possível obter o endereço.");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      Alert.alert("Erro", "Falha ao buscar o endereço.");
    }
  };

  const handleAddContact = async () => {
    if (!name || !address) {
      Alert.alert("Erro", "Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const newContact = {
        name, // Nome digitado pelo usuário
        address,
        houseNumber: locationDetails.houseNumber || "", // Inclui o número do imóvel
        ...locationDetails, // Inclui os detalhes da localização
      };

      console.log("Enviando contato:", newContact);
      await addContact(newContact);

      Alert.alert("Sucesso", "Contato salvo com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      Alert.alert("Erro", "Não foi possível salvar o contato.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
          onChangeText={handleAddressChange}
          style={styles.input}
        />
        <Text style={styles.addressText}>
          Endereço: {address || "Digite um local ou clique no mapa"}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleAddContact}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: locationDetails.latitude,
          longitude: locationDetails.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={{
            latitude: locationDetails.latitude,
            longitude: locationDetails.longitude,
          }}
          title={`${locationDetails.houseNumber || ""} ${
            locationDetails.street || ""
          }`}
          description={`${locationDetails.city || locationDetails.subregion || ""}, ${
            locationDetails.region || ""
          }`}
        />
      </MapView>
    </KeyboardAvoidingView>
  );
};

export default AddContactScreen;
