import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOfficeDto, Office, UpdateOfficeDto } from "./office.dto";
import { 
    getAllOffices,
    getOfficeById,
    createOffice,
    updateOffice,
    deleteOffice
} from "@/lib/actions/office.actions";

// 📦 Get all offices
export function useOffices() {
  return useQuery<Office[]>({
    queryKey: ["offices"],
    queryFn: getAllOffices,
  });
}

// 📦 Get a specific office by ID
export function useOffice(id: number) {
  return useQuery<Office>({
    queryKey: ["offices", id],
    queryFn: () => getOfficeById(id),
    enabled: !!id,
  });
}

// ✍️ Create new office
export function useCreateOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOfficeDto) => createOffice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });
}

// 🔁 Update office
export function useUpdateOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOfficeDto }) =>
      updateOffice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });
}

// ❌ Delete office
export function useDeleteOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });
}
