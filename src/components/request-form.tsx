'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { validateEmail, validateAmount, validateSelfRequest, dollarsToCents } from '@/lib/validators';

export function RequestForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailError = validateEmail(recipientEmail);
    if (emailError) newErrors.email = emailError;
    const amountCents = dollarsToCents(amount);
    const amountError = validateAmount(amountCents);
    if (amountError) newErrors.amount = amountError;
    if (!newErrors.email) {
      const selfError = validateSelfRequest(userEmail, recipientEmail);
      if (selfError) newErrors.email = selfError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_email: recipientEmail.trim().toLowerCase(),
          amount: dollarsToCents(amount),
          note: note.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to create request');
        setLoading(false);
        return;
      }
      const data = await res.json();
      toast.success('Payment request created!');
      router.push(`/requests/${data.id}?created=true`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">New Payment Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input id="recipient" type="email" placeholder="jane@example.com" value={recipientEmail}
              onChange={(e) => { setRecipientEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
              <Input id="amount" type="text" inputMode="decimal" placeholder="0.00" value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); setErrors(prev => ({ ...prev, amount: '' })); }}
                className="pl-7" />
            </div>
            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" type="text" placeholder="Dinner, rent, etc." value={note}
              onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white">
            {loading ? 'Creating...' : 'Send Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
