import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useLogin } from "@/api/auth/hook";

export default function LoginPage() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const loginMutation = useLogin();

  const onSubmit = async (values: LoginSchema) => {
    try {
      // 🚫 Disable API call for now
      // const res = await loginMutation.mutateAsync(values);
      // setToken(res.token);

      // ✅ TEMPORARY MOCK LOGIN
      setToken("mock-token");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";

      if (msg.toLowerCase().includes("username")) {
        form.setError("username", { type: "manual", message: msg });
      } else if (msg.toLowerCase().includes("password")) {
        form.setError("password", { type: "manual", message: msg });
      } else {
        form.setError("username", { type: "manual", message: msg });
        form.setError("password", { type: "manual", message: msg });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <Card className="rounded-3xl py-16 px-24 border-0 space-y-13 bg-white">
        <h1 className="text-3xl font-bold text-center">Sign In to LostLink</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="username" 
                      placeholder="Username" 
                      {...field} 
                      className="w-[350px] p-4.5 rounded-xl min-h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      {...field} 
                      className="w-[350px] p-4.5 rounded-xl min-h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full text-white mt-5 rounded-xl min-h-10"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
