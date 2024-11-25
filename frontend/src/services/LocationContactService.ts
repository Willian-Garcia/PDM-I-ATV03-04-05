import { IContact } from '../types/IContact';
import api from './api';

export const getContacts = async () => {
  const response = await api.get('/');
  return response.data;
};

export const addContact = async (contact: Omit<IContact, 'id'>) => {
  const response = await api.post('/', contact);
  return response.data;
};

export const updateContact = async (contact: IContact) =>{
    const response = await api.put("/", contact);
    return response.data;
}

export const deleteContact = async (id: number) => {
  const response = await api.delete(`/?id=${id}`);
  return response.data;
};