import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Payment Done!</h1>
        <p className="text-neutral-500 mb-8">The payment was processed.</p>
        <Link href="/dashboard">
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
