import Link from 'next/link';
import type { PaymentRequest, RequestDirection } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { formatCurrency } from '@/lib/validators';

export function RequestCard({ request, direction }: { request: PaymentRequest; direction: RequestDirection }) {
  const otherParty = direction === 'outgoing'
    ? request.recipient_email
    : (request.sender?.email ?? 'Unknown');
  const label = direction === 'outgoing' ? 'To' : 'From';

  return (
    <Link
      href={`/requests/${request.id}`}
      className="block bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-neutral-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-neutral-900 truncate">{otherParty}</span>
          </div>
          {request.note && (
            <p className="text-sm text-neutral-500 truncate">{request.note}</p>
          )}
          <p className="text-xs text-neutral-400 mt-1">
            {new Date(request.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-lg font-semibold text-neutral-900">{formatCurrency(request.amount)}</span>
          <StatusBadge status={request.status} />
        </div>
      </div>
    </Link>
  );
}
