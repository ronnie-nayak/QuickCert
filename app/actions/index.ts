'use server';

import { signIn, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function doSocialLogin(formData: FormData) {
  const action = formData.get('action') as string;
  await signIn(action, { redirectTo: '/initialize' });
}

export async function doLogout() {
  await signOut({ redirectTo: '/' });
}

export async function doCredentialsLogin(
  name: string,
  email: string,
  password: string,
  type: 'login' | 'register'
) {
  try {
    await signIn('credentials', {
      type,
      name,
      email,
      password,
      redirect: false
    });
  } catch (error: any) {
    throw new Error(error.cause.error);
  }

  redirect('/initialize');
}
