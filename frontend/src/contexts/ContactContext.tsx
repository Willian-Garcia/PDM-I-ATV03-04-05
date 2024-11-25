import React, { createContext, useState, useEffect, ReactNode } from "react";
import { IContact } from "../types/IContact";
import { getContacts } from "../services/LocationContactService";

interface ContactContextData {
  contacts: IContact[];
  loadContacts: () => Promise<void>;
}

export const ContactContext = createContext<ContactContextData | undefined>(
  undefined
);

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider = ({ children }: ContactProviderProps) => {
  const [contacts, setContacts] = useState<IContact[]>([]);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, loadContacts }}>
      {children}
    </ContactContext.Provider>
  );
};
