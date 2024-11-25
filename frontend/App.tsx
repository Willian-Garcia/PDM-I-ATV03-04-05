import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/rootStack";
import { AddContactScreen, ContactScreen, HomeScreen, LocationScreen,} from "./src/screens";
import { ContactProvider } from './src/contexts/ContactContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ContactProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Início", headerShown: true }}
          />
          <Stack.Screen
            name="ContactScreen"
            component={ContactScreen}
            options={{ title: "Contatos", headerShown: true }}
          />
          <Stack.Screen
            name="AddContactScreen"
            component={AddContactScreen}
            options={{ title: "Adicionar Contatos", headerShown: true }}
          />
          <Stack.Screen
            name="LocationScreen"
            component={LocationScreen}
            options={{ title: "Localização", headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactProvider>
  );
}
