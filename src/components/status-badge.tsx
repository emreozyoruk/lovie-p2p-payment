import { Badge } from '@/components/ui/badge';
import type { RequestStatus } from '@/lib/types';

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  expired: { label: 'Expired', className: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-100' },
  cancelled: { label: 'Cancelled', className: 'bg-neutral-100 text-neutral-500 hover:bg-neutral-100' },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
