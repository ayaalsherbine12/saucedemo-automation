import { loadJson } from '../shared/json-data.util';

export type LoginTestData = {
  baseUrl: string;
  credentials: { username: string; password: string };
  messages: { inventoryTitle: string };
};

export function getLoginTestData(): LoginTestData {
  return loadJson<LoginTestData>('testData/login/login.json');
}