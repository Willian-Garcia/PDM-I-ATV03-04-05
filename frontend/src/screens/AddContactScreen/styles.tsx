import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formcontainer: {
    padding:18,
    paddingBottom:5,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  addressText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
    marginTop: 10
  },
  map: {
    flex: 1,
    width: '100%',
    height: "100%",
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: "35%",
    alignSelf: "center"
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
