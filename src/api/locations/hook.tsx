import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Location, UpdateLocationDto } from "./location.dto";
import {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
} from "@/lib/actions/locations.actions";

// All locations
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });
}

// Single location
export function useLocation(id: number) {
  return useQuery<Location>({
    queryKey: ["locations", id],
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
}

// Create
export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

// Update
export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateLocationDto }) =>
      updateLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

// Delete
export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
