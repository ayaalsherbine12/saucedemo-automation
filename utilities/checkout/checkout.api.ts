import { loadJson } from '../shared/json-data.util';

export type JsonPlaceholderUser = {
  id: number;
  name: string;
  address: {
    zipcode: string;
  };
};

export type CheckoutTestData = {
  jsonPlaceholder: { userId: number; apiUrl: string };
  overview: {
    items: Array<{ name: string; price: string }>;
    shippingInformation: string;
  };
  complete: { header: string; message: string };
  fallbackCustomer?: { firstName: string; lastName: string; postalCode: string };
};

export function getCheckoutTestData(): CheckoutTestData {
  return loadJson<CheckoutTestData>('testData/checkout/checkout.json');
}

function parseJsonPlaceholderUser(user: JsonPlaceholderUser): {
  firstName: string;
  lastName: string;
  postalCode: string;
} {
  const [firstName, ...lastParts] = user.name.trim().split(/\s+/);
  const lastName = lastParts.join(' ') || firstName;
  return { firstName, lastName, postalCode: user.address.zipcode };
}

export async function fetchCheckoutUserFromApi(
  apiUrl?: string,
): Promise<{ firstName: string; lastName: string; postalCode: string }> {
  const data = getCheckoutTestData();
  const url = apiUrl ?? data.jsonPlaceholder.apiUrl;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });

    if (!response.ok) {
      throw new Error(`JSONPlaceholder request failed: ${response.status} ${response.statusText}`);
    }

    const user = (await response.json()) as JsonPlaceholderUser;
    return parseJsonPlaceholderUser(user);
  } catch (error) {
    if (process.env.CHECKOUT_REQUIRE_API === 'true') {
      throw error;
    }
    const fallback = data.fallbackCustomer;
    if (!fallback) {
      throw error;
    }
    return {
      firstName: fallback.firstName,
      lastName: fallback.lastName,
      postalCode: fallback.postalCode,
    };
  }
}