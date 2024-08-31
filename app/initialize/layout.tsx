import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function IniLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  } else if (session?.user?.type === 'admin') {
    redirect('/admin');
  } else if (session?.user?.type === 'client') {
    redirect('/client');
  }

  return (
    <div className="flex flex-col w-full">
      <header className="flex justify-between px-14 p-4 items-center">
        <Link href="/initialize">
          <h1 className="text-3xl font-bold">Initialize</h1>
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
    </div>
  );
}
