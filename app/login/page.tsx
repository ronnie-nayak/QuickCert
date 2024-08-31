'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn, signOut } from '@/lib/auth';
import { doCredentialsLogin, doSocialLogin } from 'app/actions';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(100)
});

export default function LoginPage() {
  const { toast } = useToast();

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password } = values;
      await doCredentialsLogin('', email, password, 'login');

      toast({
        title: 'Login Successful',
        description: 'You are now logged in',
        variant: 'success'
      });
      router.replace('/initialize');
    } catch (error: any) {
      toast({
        title: error.message,
        description: 'Please try again',
        variant: 'destructive'
      });
      if (error.message === 'User does not exist') router.push('/register');

      console.error(error.message);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-xl">
            Login to your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-full" action={doSocialLogin}>
            <Button
              className="w-full mb-1 text-xl flex items-center gap-4 h-12"
              type="submit"
              name="action"
              value="github"
            >
              Sign in with GitHub
              <img
                src="/login/github.svg"
                alt="Logo"
                className="h-8 inline bg-white rounded-full"
              />
            </Button>
          </form>

          <form className="w-full" action={doSocialLogin}>
            <Button
              className="w-full mb-4 text-xl flex items-center gap-4 h-12"
              type="submit"
              name="action"
              value="google"
            >
              Sign in with Google
              <img
                src="/login/google.svg"
                alt="Logo"
                className="h-8 inline bg-white rounded-full"
              />
            </Button>
          </form>

          <div className="flex flex-col gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Email" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Login</Button>
              </form>
            </Form>

            <Link href="/register">
              Dont Have an Account?{' '}
              <span className="text-sky-900 underline">Register</span>
            </Link>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
