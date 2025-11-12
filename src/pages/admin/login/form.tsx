import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginSchema } from '@/lib/schemas/loginSchema';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLogin } from '@/api/auth/hook';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function LoginPage() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const loginMutation = useLogin();

  const onSubmit = async (values: LoginSchema) => {
    try {
      const res = await loginMutation.mutateAsync(values);
      setToken(res.token); // Save token to store + localStorage
      navigate('/dashboard');
      toast.success('Login succesful');
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 md:px-0 bg-foreground">
      {/* 🔙 Back button */}
      <Link
        to={'/'}
        className="absolute flex items-center text-lg font-semibold top-6 left-6 hover:text-primary"
      >
        <ArrowLeft size={24} />
        Back
      </Link>

      <Card className="flex flex-col items-center lg:rounded-3xl md:rounded-3xl rounded-none lg:p-12 md:p-12 p-0 border-0 lg:shadow-lg md:shadow-lg shadow-none gap-14 lg:bg-white md:bg-white bg-transparent">
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

            {error && <p className="text-red-500">{error}</p>}

            <Button
              type="submit"
              className="w-full text-white mt-5 rounded-xl md:text-xl h-14 min-h-10"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
