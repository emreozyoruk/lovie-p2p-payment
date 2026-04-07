export type RequestStatus = 'pending' | 'paid' | 'declined' | 'expired' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface PaymentRequest {
  id: string;
  sender_id: string;
  recipient_email: string;
  amount: number;
  currency: string;
  note: string | null;
  status: RequestStatus;
  shareable_link: string;
  expires_at: string;
  paid_at: string | null;
  declined_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: Profile;
}

export interface CreateRequestPayload {
  recipient_email: string;
  amount: number;
  note?: string;
}

export type RequestDirection = 'incoming' | 'outgoing';
