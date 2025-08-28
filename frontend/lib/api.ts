import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json'}
});

export type Item = {
  _id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

/* CRUD Helpers */
export async function getItems(): Promise<Item[]> {
  const res = await api.get('/api/items');
  return res.data
}

export async function addItem(title: string): Promise<Item[]> {
  const res = await api.post('/api/items', { title })
  return res.data
}

export async function toggleItem(id: string, done: boolean): Promise<Item[]> {
  const res = await api.patch(`/api/items/${id}`, { done })
  return res.data
}

export async function deleteItem(id: string): Promise<Item[]> {
  const res = await api.delete(`/api/items/${id}`)
  return res.data
}