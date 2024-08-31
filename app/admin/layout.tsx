import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  } else if (session?.user?.type === 'client') {
    redirect('/client');
  } else if (session?.user?.type === 'notInitialized') {
    redirect('/initialize');
  }
  return (
    <>
      <header className="flex justify-between px-14 p-4 items-center">
        <Link href="/admin">
          <h1 className="text-3xl font-bold">Admin</h1>
        </Link>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <Button className="text-lg">SignOut</Button>
        </form>
      </header>
      {children}
    </>
  );
}
