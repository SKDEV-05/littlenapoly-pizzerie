export interface ApiMenuItem {
  id: number;
  category_id: number;
  category_slug?: string;
  slug: string;
  name: string;
  ingredients_de: string;
  ingredients_en?: string;
  base_price: number;
  tax_rate: number;
  is_available: boolean;
  is_alcoholic: boolean;
  serving_size?: string;
  model_3d_key?: string;
  allergens?: {
    code: string;
    name_de: string;
    name_en: string;
    description: string;
  }[];
}

export interface ApiCategory {
  id: number;
  slug: string;
  name_de: string;
  name_en: string;
  description_de?: string;
  description_en?: string;
  sort_order: number;
  items_count?: number;
  items?: ApiMenuItem[];
}

const rawUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;

export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/menu/categories`, {
      next: { tags: ['categories'], revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error fetching categories:', error);
    return [];
  }
}

export async function fetchMenuItems(categorySlug?: string): Promise<ApiMenuItem[]> {
  try {
    const url = categorySlug
      ? `${API_BASE_URL}/menu/items?category_slug=${categorySlug}`
      : `${API_BASE_URL}/menu/items`;

    const res = await fetch(url, {
      next: { tags: ['menu-items'], revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch menu items');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error fetching menu items:', error);
    return [];
  }
}

export async function submitOrder(payload: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_time: string;
  payment_method: string;
  kitchen_notes?: string;
  items: { menu_item_id: number; quantity: number }[];
}) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Fehler beim Absenden der Bestellung.');
  }
  return data.data;
}

export async function submitReservation(payload: {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  reserved_date: string;
  time_slot: string;
  special_requests?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Fehler bei der Tischreservierung.');
  }
  return data.data;
}
