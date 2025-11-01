import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginDto } from "./auth.dto";
import authInterceptor from "./inceptor";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginDto): Promise<AuthResponse> => {
      const { data } = await authInterceptor.post("/login", payload);
      return data.data; // backend returns data inside `data`
    },
  });
}