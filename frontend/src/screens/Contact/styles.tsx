import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f5f5f5",
  },
  contactcontainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: "lightgray",
    borderRadius: 8,
  },
  contacttext: {
    fontSize: 15,
    fontWeight:"regular",
    color: 'black',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'green',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  }
});

export default styles;
