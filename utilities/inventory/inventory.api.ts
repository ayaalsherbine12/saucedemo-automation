import { loadJson } from '../shared/json-data.util';

export type InventoryTestData = {
  products: {
    fleeceJacket: { name: string; price: string };
  };
};

export function getInventoryTestData(): InventoryTestData {
  return loadJson<InventoryTestData>('testData/inventory/inventory.json');
}