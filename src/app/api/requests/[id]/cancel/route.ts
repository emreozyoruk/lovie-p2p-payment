import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { data: req, error: fetchError } = await supabase
    .from('payment_requests').select('*').eq('id', id).single();

  if (fetchError || !req) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  if (req.sender_id !== user.id) return NextResponse.json({ error: "You don't have access" }, { status: 403 });
  if (req.status !== 'pending') return NextResponse.json({ error: 'This request is not pending' }, { status: 400 });

  const { data, error } = await supabase
    .from('payment_requests')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', id).eq('status', 'pending').select().single();

  if (error || !data) return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  return NextResponse.json({ ...data, message: 'Request cancelled' });
}
