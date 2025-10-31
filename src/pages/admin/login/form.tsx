import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

async function fakeLogin(values: LoginSchema): Promise<{ success: boolean; error?: string }> {
  if (values.email !== "admin@lostlink.edu") {
    return { success: false, error: "email_not_found" };
  }

  if (values.password !== "secret123") {
    return { success: false, error: "incorrect_password" };
  }

  return { success: true };
}


export default function AdminLogin() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
  try {
    // 🔁 Replace this with actual API call
    const res = await fakeLogin(values);

    if (!res.success) {
      if (res.error === "email_not_found") {
        form.setError("email", {
          type: "manual",
          message: "No account with this email",
        });
      }

      if (res.error === "incorrect_password") {
        form.setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      }

      return;
    }

    // ✅ Success case
    console.log("Login successful!");
    // Proceed to redirect or store auth state

  } catch (error) {
    form.setError("email", {
      type: "manual",
      message: "Something went wrong. Try again later.",
    });
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} className="w-[350px] p-4.5 rounded-xl min-h-10"/>
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
                    <Input type="password" placeholder="Password" {...field} className="w-[350px] p-4.5 rounded-xl min-h-10"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full text-white mt-5 rounded-xl min-h-10">Log In</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
