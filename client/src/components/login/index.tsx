'use client';

import { loginSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

type LoginSchema = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { loginAccount, isLoading } = useAuthStore();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    await loginAccount(values, () => {
      router.push('/dashboard');
    });
  };
  return (
    <div className="min-h-[calc(100vh-150px)] relative flex items-center justify-center p-4">
      <div className="w-full max-w-md md:space-y-8 space-y-4 relative z-10 border border-neutral-600 p-8 rounded-3xl shadow-sm">
        <div className="leading-none">
          <h1 className="md:text-4xl text-3xl">Login</h1>
          <p className="text-neutral-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" replace className="text-blue-500 underline hover:text-blue-400">
              Register
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-400 text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        className="focus:visible:ring-0 md:text-base text-sm bg-secondary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-400 text-xs">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Password"
                        type="password"
                        className="focus:visible:ring-0 md:text-base text-sm bg-secondary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center pt-2">
                <Button
                  type="submit"
                  className="rounded-full px-8"
                  size={'lg'}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
