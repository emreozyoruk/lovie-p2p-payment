import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { RequestDetail } from '@/components/request-detail';
import Link from 'next/link';

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: request, error } = await supabase
    .from('payment_requests')
    .select('*, sender:profiles!sender_id(id, email, full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (error || !request) notFound();

  const isInvolved = request.sender_id === user.id || request.recipient_email === user.email;
  if (!isInvolved) notFound();

  const effectiveStatus = request.status === 'pending' && new Date(request.expires_at) < new Date()
    ? 'expired' : request.status;

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to Dashboard
        </Link>
      </div>
      <RequestDetail
        request={{ ...request, status: effectiveStatus }}
        currentUserEmail={user.email ?? ''}
        isCreated={created === 'true'}
      />
    </div>
  );
}
