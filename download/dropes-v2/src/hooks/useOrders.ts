/**
 * src/hooks/useOrders.ts
 * ------------------------------------------------------------------
 * Local order history (one record per successful checkout).
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react';
import type { OrderRecord } from '@/types';
import { loadOrders, saveOrders } from '@/lib/storage';

export function useOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>(() => loadOrders());

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => [order, ...prev].slice(0, 50));
  }, []);

  return { orders, addOrder };
}
