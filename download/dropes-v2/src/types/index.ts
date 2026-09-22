/**
 * src/types/index.ts
 * ------------------------------------------------------------------
 * Shared domain types for the Dropes storefront.
 * Strict — no `any` allowed across the public surface.
 * ------------------------------------------------------------------
 */

export type Category =
  | 'Todas'
  | 'Tecnología'
  | 'Hogar'
  | 'Belleza'
  | 'Deporte'
  | 'Cocina'
  | 'Niños';

export type ProductTag = 'PREMIUM' | 'SUPER VENTAS' | '';

export type CountryCode = 'ES' | 'PT';

export type PaymentMethod = 'cod' | 'card';

/** Product as stored in src/data/products.json */
export interface Product {
  id: string;
  numeric_id: number;
  name: string;
  priceNow: string;
  priceWas: string;
  profit: string;
  original_cost: string;
  image: string;
  stars: string;
  reviews: string;
  category: Category | string;
  tag: ProductTag;
  description?: string;
  brand?: string;
}

/** Product in the shopping cart */
export interface CartItem extends Product {
  quantity: number;
}

/** Customer shipping information sent to Dropea */
export interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: CountryCode;
}

/** Payload for the GraphQL orderCreate mutation */
export interface OrderRequest {
  shop_id: number;
  payment_method: 'CASH_ON_DELIVERY' | 'CARD';
  customer: Customer;
  products: Array<{
    product_id: number;
    unit_price: number;
    quantity: number;
    total_value: number;
  }>;
}

/** Order record persisted locally for user history */
export interface OrderRecord {
  id: string;
  createdAt: string;
  total: string;
  items: Array<{ name: string; quantity: number; priceNow: string; image: string }>;
  customer: Pick<Customer, 'first_name' | 'last_name' | 'email' | 'city' | 'country'>;
  payment_method: PaymentMethod;
  status: 'pending' | 'confirmed' | 'failed';
  dropea_id?: string;
}

/** Locally stored user (email-only "magic" account) */
export interface LocalUser {
  email: string;
  name: string;
  createdAt: string;
}

/** Response envelope from Dropea GraphQL */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
}

/** Province / district option for the address dropdown */
export interface RegionOption {
  value: string;
  label: string;
}

/** Sort options for catalog */
export type SortOption = 'relevant' | 'a-z' | 'z-a' | 'price-asc' | 'price-desc';

/** Favorites stored as a Set of product IDs */
export type FavoriteSet = string[];
