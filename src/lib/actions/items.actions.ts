import type { ItemDto, ItemListResponse, ItemResponse, UpdateItemStatusDto } from "@/api/items/item.dto";
import axios from "axios";

const base = `${import.meta.env.VITE_API_URL}/items`;

export async function fetchAllItems(full = false, status = "LISTED"): Promise<ItemResponse[]> {
  const params = { full, status };
  const res = await axios.get<ItemListResponse>(base, { params });
  return res.data.data;
}

export async function fetchItemById(id: number) {
  const res = await axios.get(`${base}/${id}`);
  return res.data.data;
}

export async function createItem(payload: ItemDto) {
  const res = await axios.post(base, payload);
  return res.data.data;
}

export async function updateItemStatus(id: number, payload: UpdateItemStatusDto) {
  const res = await axios.patch(`${base}/${id}`, payload);
  return res.data.data;
}

export async function deleteItem(id: number) {
  const res = await axios.delete(`${base}/${id}`);
  return res.data.data;
}
