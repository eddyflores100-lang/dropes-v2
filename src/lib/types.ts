export type Category =
  | "Tecnología"
  | "Hogar"
  | "Belleza"
  | "Deporte"
  | "Cocina"
  | "Niños";

export type ProductTag = "PREMIUM" | "SUPER VENTAS" | "TOP VENTAS" | "INNOVACIÓN" | "COCINA PRO" | "BLUETOOTH 5.3" | "ECO-TECH" | "CONFORT" | "SEGURIDAD" | "DESCANSO" | "CINE EN CASA" | "HD WIRELESS" | "";

export type CountryCode = "ES" | "PT";

export type PaymentMethod = "cod" | "card";

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
  category: Category;
  tag: ProductTag;
  tag2?: string;
  description?: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

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

export type SortOption = "relevant" | "price-asc" | "price-desc" | "name";

export interface LocalUser {
  email: string;
  name: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  total: number;
  items: Array<{ name: string; quantity: number; priceNow: string; image: string }>;
  customer: Pick<Customer, "first_name" | "last_name" | "email" | "city" | "country">;
  paymentMethod: PaymentMethod;
  status: "pending" | "confirmed" | "failed";
  partnerOrderId?: string;
}
