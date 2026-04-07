import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { validateEmail, validateAmount, validateSelfRequest } from '@/lib/validators';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const body = await request.json();
  const { recipient_email, amount, note } = body;

  const emailError = validateEmail(recipient_email);
  if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });

  const amountError = validateAmount(amount);
  if (amountError) return NextResponse.json({ error: amountError }, { status: 400 });

  const selfError = validateSelfRequest(user.email ?? '', recipient_email);
  if (selfError) return NextResponse.json({ error: selfError }, { status: 400 });

  const { data, error } = await supabase
    .from('payment_requests')
    .insert({
      sender_id: user.id,
      recipient_email: recipient_email.trim().toLowerCase(),
      amount,
      note: note || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const direction = searchParams.get('direction') ?? 'outgoing';
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let query = supabase
    .from('payment_requests')
    .select('*, sender:profiles!sender_id(id, email, full_name, avatar_url)')
    .order('created_at', { ascending: false });

  if (direction === 'outgoing') {
    query = query.eq('sender_id', user.id);
  } else {
    query = query.eq('recipient_email', user.email!);
  }

  if (status) query = query.eq('status', status);
  if (search) {
    if (direction === 'outgoing') {
      query = query.ilike('recipient_email', `%${search}%`);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  const processed = (data ?? []).map((req) => {
    if (req.status === 'pending' && new Date(req.expires_at) < now) {
      return { ...req, status: 'expired' as const };
    }
    return req;
  });

  return NextResponse.json(processed);
}
