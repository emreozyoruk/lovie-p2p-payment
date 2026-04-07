'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { RequestCard } from './request-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { PaymentRequest, RequestDirection } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function DashboardTabs() {
  const [direction, setDirection] = useState<RequestDirection>('incoming');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ direction });
    if (status !== 'all') params.set('status', status);
    if (search.trim()) params.set('search', search.trim());
    try {
      const res = await fetch(`/api/requests?${params}`);
      if (res.ok) setRequests(await res.json());
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [direction, status, search]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <Link href="/requests/new">
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">+ New Request</Button>
        </Link>
      </div>
      <Tabs value={direction} onValueChange={(v) => setDirection(v as RequestDirection)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="incoming" className="flex-1 sm:flex-none">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing" className="flex-1 sm:flex-none">Outgoing</TabsTrigger>
        </TabsList>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Input placeholder="Search by email..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900">
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <TabsContent value="incoming" className="mt-4">
          <RequestList requests={requests} direction="incoming" loading={loading} />
        </TabsContent>
        <TabsContent value="outgoing" className="mt-4">
          <RequestList requests={requests} direction="outgoing" loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestList({ requests, direction, loading }: {
  requests: PaymentRequest[]; direction: RequestDirection; loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">No requests yet.</p>
        {direction === 'outgoing' && (
          <Link href="/requests/new" className="text-sm text-neutral-900 font-medium hover:underline mt-2 inline-block">
            Create your first one →
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <RequestCard key={req.id} request={req} direction={direction} />
      ))}
    </div>
  );
}
