'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency } from '@/lib/validators';
import type { RequestStatus } from '@/lib/types';

interface ShareableRequest {
  id: string;
  recipient_email: string;
  amount: number;
  currency: string;
  note: string | null;
  status: RequestStatus;
  expires_at: string;
  created_at: string;
  sender: { email: string; full_name: string | null } | null;
}

export default function ShareableLinkPage() {
  const params = useParams();
  const [request, setRequest] = useState<ShareableRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/requests/share/${params.link}`)
      .then((res) => { if (!res.ok) throw new Error('Not found'); return res.json(); })
      .then(setRequest)
      .catch(() => setError('Request not found'))
      .finally(() => setLoading(false));
  }, [params.link]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="h-8 w-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
    </div>
  );

  if (error || !request) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-neutral-500">Request not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Payment Request</CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-neutral-900">{formatCurrency(request.amount)}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">From</span>
              <span className="font-medium">{request.sender?.email ?? 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">To</span>
              <span className="font-medium">{request.recipient_email}</span>
            </div>
            {request.note && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Note</span>
                <span>{request.note}</span>
              </div>
            )}
          </div>
          {request.status === 'pending' && (
            <p className="text-xs text-neutral-400 text-center pt-2">
              Log in as {request.recipient_email} to pay this request.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
