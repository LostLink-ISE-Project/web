// src/api/categories/hook.tsx

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryInterceptor from "./inceptor";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

// GET ALL
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await categoryInterceptor.get("");
      return data.data;
    },
  });
}

// CREATE
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCategoryDto) => {
      const { data } = await categoryInterceptor.post("", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// UPDATE
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: UpdateCategoryDto) => {
      const { data } = await categoryInterceptor.put(`/${id}`, { id, name });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// DELETE
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await categoryInterceptor.delete(`/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
