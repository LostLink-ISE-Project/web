import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type {
  AuthResponse,
  LoginDto,
  MeResponse,
  UpdateMeDto,
  ResetPasswordDto,
} from "./auth.dto";
import authInterceptor from "./inceptor";
import { useAuthStore } from "@/lib/stores/auth.store";

// LOGIN
export function useLogin() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: LoginDto): Promise<AuthResponse> => {
      const { data } = await authInterceptor.post("/login", payload);
      return { token: data.data }; // data is a string token
    },
    onSuccess: () => {qc.invalidateQueries({ queryKey: ["me"] });},
  });
}

// GET CURRENT USER
export function useMe(options?: Partial<UseQueryOptions<MeResponse>>) {
  const token = useAuthStore((s) => s.token);

  return useQuery<MeResponse>({
    queryKey: ["me", token],
    queryFn: async () => {
      const { data } = await authInterceptor.get("/me");
      return data.data;
    },
    // safely spread the optional overrides
    enabled: !!token,                 // don't run when logged out
    staleTime: 0,                     // always treat as stale
    gcTime: 0,                        // drop quickly when unused
    refetchOnMount: "always",         // on every mount, get fresh me
    ...options,
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
