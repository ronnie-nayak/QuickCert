import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  } else if (session?.user?.type === 'admin') {
    redirect('/admin');
  } else if (session?.user?.type === 'notInitialized') {
    redirect('/initialize');
  }

  return (
    <>
      <header className="flex justify-between px-14 p-4 items-center">
        <div className="flex gap-8">
          <Link href="/client">
            <h1 className="text-3xl font-bold">Client</h1>
          </Link>
          <Link href="/client/new-doc">
            <Button className="text-lg flex gap-2 items-center">
              <FaPlus />
              New Request
            </Button>
          </Link>
        </div>
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
