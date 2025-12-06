export type UserRole = 'user' | 'admin' | 'organizer';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
export type TicketStatus = 'valid' | 'used' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location_name: string;
  location_address: string | null;
  price_amount: number;
  price_currency: string;
  total_capacity: number;
  remaining_capacity: number;
  image_url: string | null;
  status: EventStatus;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_provider_id: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  order_id: string;
  owner_id: string | null;
  qr_code: string | null;
  status: TicketStatus;
  used_at: string | null;
  created_at: string;
}
