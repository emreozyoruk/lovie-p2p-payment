'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function Header({ email }: { email: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-neutral-900">
          PayRequest
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500 hidden sm:block">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
