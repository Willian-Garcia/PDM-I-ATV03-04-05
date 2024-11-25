import React, { createContext, useState, useEffect, ReactNode } from "react";
import { IContact } from "../types/IContact";
import {
  getContacts,
  deleteContact as deleteContactService,
  updateContact as updateContactService,
} from "../services/LocationContactService";

interface ContactContextData {
  contacts: IContact[];
  loadContacts: () => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  updateContact: (updatedContact: IContact) => Promise<void>;
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

  const deleteContact = async (id: number) => {
    try {
      await deleteContactService(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
    }
  };

  const updateContact = async (updatedContact: IContact) => {
    try {
      const response = await updateContactService(updatedContact);
  
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === response.id ? response : contact
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar contato no contexto:", error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, loadContacts, deleteContact, updateContact }}>
      {children}
    </ContactContext.Provider>
  );
};
