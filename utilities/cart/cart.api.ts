import { loadJson } from '../shared/json-data.util';

export type CartTestData = {
  expectedItemCount: number;
  items: Array<{ name: string; price: string }>;
};

export function getCartTestData(): CartTestData {
  return loadJson<CartTestData>('testData/cart/cart.json');
}