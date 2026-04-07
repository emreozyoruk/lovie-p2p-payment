import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ link: string }> }
) {
  const { link } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payment_requests')
    .select('id, recipient_email, amount, currency, note, status, expires_at, created_at, sender:profiles!sender_id(email, full_name)')
    .eq('shareable_link', link)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  if (data.status === 'pending' && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ ...data, status: 'expired' });
  }

  return NextResponse.json(data);
}
