'use client';

import { registerSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/AuthStore/useAuthStore';

type RegisterSchema = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const { isLoading, registerAccount } = useAuthStore();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    await registerAccount(values, () => {
      toast.success('Registered successfully!');
      router.push('/login');
    });
  };

  return (
    <div className="min-h-[calc(100vh-150px)] relative flex items-center justify-center p-4">
      <div className="w-full max-w-md md:space-y-8 space-y-4 relative z-10  border border-neutral-600 p-8 rounded-3xl shadow-sm">
        <div className="leading-none">
          <h1 className="md:text-4xl text-3xl">Register</h1>
          <p className="text-neutral-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" replace className="text-blue-500 underline hover:text-blue-400">
              Login
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-400 text-xs">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-400 text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
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
                        type="password"
                        placeholder="Create a password"
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
                  {isLoading ? 'Creating Account...' : 'Submit'}
                </Button>
              </div>

              <p className="text-[10px] text-neutral-400 text-center">
                By creating an account you accept our{' '}
                <Link
                  href="/privacy"
                  className="text-neutral-500 font-semibold underline hover:text-neutral-400"
                >
                  privacy policies
                </Link>{' '}
                &{' '}
                <Link
                  href="/terms"
                  className="text-neutral-500 font-semibold underline hover:text-neutral-400"
                >
                  terms and conditions
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
