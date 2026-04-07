'use client';

import { useEffect, useState } from 'react';

function getTimeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(' ');
}

export function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiresAt));
    }, 60_000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft) {
    return <span className="text-sm text-red-600 font-medium">Expired</span>;
  }

  return (
    <span className="text-sm text-neutral-500">
      Expires in <span className="font-medium text-neutral-700">{timeLeft}</span>
    </span>
  );
}
