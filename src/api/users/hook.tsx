import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserDto, User } from "./user.dto";
import {
    getAllUsers,
    createUser,
    updateUser,
    disableUser,
} from "@/lib/actions/users.actions";

// GET all users
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
}

// CREATE user
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// UPDATE user
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserDto }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// DISABLE user
export function useDisableUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disableUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}