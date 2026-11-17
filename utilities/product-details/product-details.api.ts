import { loadJson } from '../shared/json-data.util';

export type ProductDetailsTestData = {
  products: {
    onesie: { name: string; price: string };
  };
};

export function getProductDetailsTestData(): ProductDetailsTestData {
  return loadJson<ProductDetailsTestData>('testData/product-details/product-details.json');
}