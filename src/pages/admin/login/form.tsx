import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useLogin } from "@/api/auth/hook";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
      const res = await loginMutation.mutateAsync(values);
      setToken(res.token); // Save token to store + localStorage
      navigate("/dashboard");
      toast.success("Login succesful");
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
    <div className="min-h-screen flex items-center justify-center px-6 md:px-0 bg-foreground">
      {/* 🔙 Back button */}
      <Link
        to={"/"}
        className="absolute flex items-center text-lg font-semibold top-6 left-6 hover:text-primary"
      >
        <ArrowLeft size={24} />
        Back
      </Link>

      <Card className="flex flex-col items-center rounded-3xl py-9 md:py-16 px-6 md:px-24 border-0 shadow-lg space-y-8 md:space-y-13 bg-white">
        <h1 className="text-3xl font-bold text-center">Sign In to LostLink</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
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
                      className="w-[300px] md:w-[350px] p-4.5 rounded-xl h-14"
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
                      className="w-[300px] md:w-[350px] p-4.5 rounded-xl h-14"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full text-white mt-5 rounded-xl md:text-xl h-14 min-h-10"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
