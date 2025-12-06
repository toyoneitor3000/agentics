'use server';

import { Event } from '@/types';

// Mock data to simulate DB fetch until Supabase is connected
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    organizer_id: 'org1',
    title: 'Neon Nights Festival',
    description: 'A night of neon and music.',
    start_date: '2023-10-15T20:00:00Z',
    end_date: null,
    location_name: 'Arena Ciudad de México',
    location_address: 'Av. de las Granjas 800',
    price_amount: 120000,
    price_currency: 'MXN',
    total_capacity: 5000,
    remaining_capacity: 120,
    image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    organizer_id: 'org1',
    title: 'Electro Vibes 2024',
    description: 'Electronic music festival.',
    start_date: '2023-11-02T18:00:00Z',
    end_date: null,
    location_name: 'Foro Sol',
    location_address: null,
    price_amount: 95000,
    price_currency: 'MXN',
    total_capacity: 20000,
    remaining_capacity: 5000,
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    organizer_id: 'org2',
    title: 'Jazz & Wine',
    description: 'Relaxing jazz evening.',
    start_date: '2023-11-10T19:00:00Z',
    end_date: null,
    location_name: 'Parque Bicentenario',
    location_address: null,
    price_amount: 45000,
    price_currency: 'MXN',
    total_capacity: 300,
    remaining_capacity: 20,
    image_url: 'https://images.unsplash.com/photo-1514525253440-b393452e2380?q=80&w=1000&auto=format&fit=crop',
    status: 'published',
    created_at: new Date().toISOString()
  }
];

export async function getFeaturedEvents(): Promise<Event[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In the future: const { data } = await supabase.from('events').select('*')...
  return MOCK_EVENTS;
}
