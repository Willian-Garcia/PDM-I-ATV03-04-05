import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "./styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/rootStack";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "LocationScreen"> {}

const LocationScreen: React.FC<Props> = ({ route }) => {
  const { latitude, longitude } = route.params;

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
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Localização do Contato"
        />
      </MapView>
    </View>
  );
};

export default LocationScreen;
