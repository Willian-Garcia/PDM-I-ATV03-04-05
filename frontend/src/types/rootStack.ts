import { ParamListBase } from '@react-navigation/native';

export interface RootStackParamList extends ParamListBase {
    HomeScreen: undefined; 
    ContactScreen: undefined;
    AddContactScreen: undefined;
    LocationScreen: { id: number; latitude: number; longitude: number };
}

  