/**
 * src/lib/dropea.ts
 * ------------------------------------------------------------------
 * Thin GraphQL client for the Dropea dropshipping API.
 * Reads the API key from import.meta.env (VITE_ prefix → inlined by Vite).
 * ------------------------------------------------------------------
 */

import type {
  Customer,
  GraphQLResponse,
  OrderRequest,
  PaymentMethod,
} from '@/types';

const ENDPOINT = 'https://api.dropea.com/graphql/dropshippers';
const API_KEY = import.meta.env.VITE_DROPEA_API_KEY;
const SHOP_ID = parseInt(import.meta.env.VITE_DROPEA_SHOP_ID ?? '12928', 10);

const CREATE_ORDER_MUTATION = /* GraphQL */ `
  mutation CreateOrder(
    $shop_id: Int!
    $payment_method: PaymentMethodEnum!
    $customer: CustomerInputType!
    $products: [OrderProductInputType!]!
  ) {
    orderCreate(
      shop_id: $shop_id
      payment_method: $payment_method
      customer: $customer
      products: $products
    ) {
      id
    }
  }
`;

interface CreateOrderResult {
  orderCreate: { id: string } | null;
}

function assertConfig(): void {
  if (!API_KEY) {
    throw new Error(
      'VITE_DROPEA_API_KEY no configurada. Copia .env.example a .env y reinicia el dev server.'
    );
  }
  if (!Number.isFinite(SHOP_ID) || SHOP_ID <= 0) {
    throw new Error(`VITE_DROPEA_SHOP_ID inválido: "${import.meta.env.VITE_DROPEA_SHOP_ID}"`);
  }
}

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  assertConfig();

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Dropea HTTP ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as GraphQLResponse<T>;
}

/**
 * Submit an order to Dropea.
 * @returns the Dropea order id
 * @throws Error with a user-friendly message if the API rejects the order
 */
export async function createOrder(params: {
  cart: Array<{ id: string; priceNow: string; quantity: number }>;
  customer: Customer;
  paymentMethod: PaymentMethod;
}): Promise<string> {
  const order: OrderRequest = {
    shop_id: SHOP_ID,
    payment_method:
      params.paymentMethod === 'cod' ? 'CASH_ON_DELIVERY' : 'CARD',
    customer: params.customer,
    products: params.cart.map((item) => {
      const unitPrice = parseFloat(item.priceNow.replace(',', '.'));
      return {
        product_id: parseInt(item.id, 10),
        unit_price: unitPrice,
        quantity: item.quantity,
        total_value: unitPrice * item.quantity,
      };
    }),
  };

  const res = await graphql<CreateOrderResult>(
    CREATE_ORDER_MUTATION,
    order as unknown as Record<string, unknown>
  );

  if (res.errors?.length) {
    throw new Error(res.errors[0].message);
  }
  if (!res.data?.orderCreate?.id) {
    throw new Error('Dropea no devolvió un id de pedido.');
  }
  return res.data.orderCreate.id;
}
