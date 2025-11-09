import type { Category } from "@/api/categories/category.dto";
import axios from "axios";

const base = `${import.meta.env.VITE_API_URL}/categories`;

export async function fetchCategories(): Promise<Category[]> {
  const res = await axios.get(base);
  return res.data.data;
}
