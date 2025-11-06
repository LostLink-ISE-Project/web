import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  AuthResponse,
  LoginDto,
  MeResponse,
  UpdateMeDto,
  ResetPasswordDto,
} from "./auth.dto";
import authInterceptor from "./inceptor";

// LOGIN
export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginDto): Promise<AuthResponse> => {
      const { data } = await authInterceptor.post("/login", payload);
      return { token: data.data }; // data is a string token
    },
  });
}

// GET CURRENT USER
export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await authInterceptor.get("/me");
      return data.data;
    },
  });
}

// UPDATE CURRENT USER
export function useUpdateMe() {
  return useMutation({
    mutationFn: async (payload: UpdateMeDto): Promise<MeResponse> => {
      const { data } = await authInterceptor.patch("/me", payload);
      return data.data;
    },
  });
}

// RESET PASSWORD
export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordDto): Promise<void> => {
      const { data } = await authInterceptor.post("/me/reset-password", payload);
      if (!data.ok) throw new Error(data.message);
    },
  });
}
