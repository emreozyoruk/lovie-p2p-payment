'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './status-badge';
import { CountdownTimer } from './countdown-timer';
import { formatCurrency } from '@/lib/validators';
import { toast } from 'sonner';
import type { PaymentRequest } from '@/lib/types';

export function RequestDetail({ request, currentUserEmail, isCreated }: {
  request: PaymentRequest;
  currentUserEmail: string;
  isCreated?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const isRecipient = request.recipient_email === currentUserEmail;
  const isSender = request.sender_id !== undefined && !isRecipient;
  const isPending = request.status === 'pending';
  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pay/${request.shareable_link}` : '';

  const handleAction = async (action: 'pay' | 'decline' | 'cancel') => {
    setLoading(true);
    if (action === 'pay') setPaymentProcessing(true);
    try {
      const res = await fetch(`/api/requests/${request.id}/${action}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || `Failed to ${action}`);
        return;
      }
      if (action === 'pay') {
        toast.success('Payment done!');
        router.push(`/requests/${request.id}/success`);
      } else {
        toast.success(data.message);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast.success('Link copied!');
  };

  return (
    <>
      {paymentProcessing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-neutral-900">Processing payment...</p>
            <p className="text-sm text-neutral-500 mt-1">This will take a few seconds</p>
          </div>
        </div>
      )}
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Request Details</CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-neutral-900">{formatCurrency(request.amount)}</p>
            <p className="text-sm text-neutral-500 mt-1">{request.currency}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">From</span>
              <span className="font-medium text-neutral-900">{request.sender?.email ?? 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">To</span>
              <span className="font-medium text-neutral-900">{request.recipient_email}</span>
            </div>
            {request.note && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Note</span>
                <span className="text-neutral-700">{request.note}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Created</span>
              <span className="text-neutral-700">
                {new Date(request.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                })}
              </span>
            </div>
            {isPending && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Expires</span>
                <CountdownTimer expiresAt={request.expires_at} />
              </div>
            )}
            {request.paid_at && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Paid</span>
                <span className="text-green-700">
                  {new Date(request.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
          {isCreated && (
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-xs text-neutral-500 mb-2">Shareable Link</p>
              <div className="flex gap-2">
                <input readOnly value={shareableUrl}
                  className="flex-1 text-xs bg-white border border-neutral-200 rounded px-2 py-1.5 text-neutral-600" />
                <Button size="sm" variant="outline" onClick={copyLink}>Copy</Button>
              </div>
            </div>
          )}
          {isPending && (
            <div className="space-y-2 pt-2">
              {isRecipient && (
                <>
                  <Button onClick={() => handleAction('pay')} disabled={loading}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white">
                    {loading ? 'Processing...' : 'Pay'}
                  </Button>
                  <Button onClick={() => handleAction('decline')} disabled={loading}
                    variant="outline" className="w-full h-11 border-red-200 text-red-600 hover:bg-red-50">
                    Decline
                  </Button>
                </>
              )}
              {isSender && (
                <Button onClick={() => handleAction('cancel')} disabled={loading}
                  variant="outline" className="w-full h-11">
                  Cancel Request
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
