import { useContext } from "react";
import { ContactContext } from "src/contexts/ContactContext";

const useContacts = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContacts deve ser usado dentro de um ContactProvider");
  }

  return context;
};

export default useContacts;