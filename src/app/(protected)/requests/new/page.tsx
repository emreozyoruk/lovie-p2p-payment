import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RequestForm } from '@/components/request-form';
import Link from 'next/link';

export default async function NewRequestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to Dashboard
        </Link>
      </div>
      <RequestForm userEmail={user.email ?? ''} />
    </div>
  );
}
