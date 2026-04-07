import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { data, error } = await supabase
    .from('payment_requests')
    .select('*, sender:profiles!sender_id(id, email, full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  const isInvolved = data.sender_id === user.id || data.recipient_email === user.email;
  if (!isInvolved) return NextResponse.json({ error: "You don't have access" }, { status: 403 });

  if (data.status === 'pending' && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ ...data, status: 'expired' });
  }

  return NextResponse.json(data);
}
