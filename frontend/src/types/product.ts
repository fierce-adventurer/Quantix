export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  isLowStock: boolean;
  currency?: string;
  locationType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  currency?: string;
  locationType?: string;
}

export interface UpdateProductInput {
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  currency?: string;
  locationType?: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  country: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD - United States ($)', country: 'United States' },
  { code: 'INR', symbol: '₹', label: 'INR - India (₹)', country: 'India' },
  { code: 'EUR', symbol: '€', label: 'EUR - European Union (€)', country: 'European Union' },
  { code: 'GBP', symbol: '£', label: 'GBP - United Kingdom (£)', country: 'United Kingdom' },
  { code: 'CAD', symbol: 'C$', label: 'CAD - Canada (C$)', country: 'Canada' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australia (A$)', country: 'Australia' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japan (¥)', country: 'Japan' },
  { code: 'AED', symbol: 'د.إ', label: 'AED - UAE (د.إ)', country: 'United Arab Emirates' },
  { code: 'SGD', symbol: 'S$', label: 'SGD - Singapore (S$)', country: 'Singapore' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF - Switzerland (CHF)', country: 'Switzerland' },
];

export const LOCATION_TYPE_OPTIONS: string[] = [
  'Retail Storefront',
  'Main Warehouse',
  'Backroom Storage',
  'Aisle / Shelf Bay',
  'Fulfillment Hub',
  'Cold Storage',
  'Online Reserve',
];

export const getCurrencySymbol = (code?: string): string => {
  if (!code) return '$';
  const found = CURRENCY_OPTIONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found ? found.symbol : code;
};

export const detectLocationCurrency = (): { currency: string; country: string } => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.includes('Asia/Colombo')) {
      return { currency: 'INR', country: 'India' };
    }
    if (timeZone.includes('London') || timeZone.includes('Europe/Belfast')) {
      return { currency: 'GBP', country: 'United Kingdom' };
    }
    if (timeZone.includes('Berlin') || timeZone.includes('Paris') || timeZone.includes('Rome') || timeZone.includes('Madrid') || timeZone.includes('Amsterdam') || timeZone.includes('Europe')) {
      return { currency: 'EUR', country: 'European Union' };
    }
    if (timeZone.includes('Tokyo')) {
      return { currency: 'JPY', country: 'Japan' };
    }
    if (timeZone.includes('Toronto') || timeZone.includes('Vancouver') || timeZone.includes('Montreal')) {
      return { currency: 'CAD', country: 'Canada' };
    }
    if (timeZone.includes('Sydney') || timeZone.includes('Melbourne') || timeZone.includes('Brisbane') || timeZone.includes('Australia')) {
      return { currency: 'AUD', country: 'Australia' };
    }
    if (timeZone.includes('Dubai')) {
      return { currency: 'AED', country: 'United Arab Emirates' };
    }
    if (timeZone.includes('Singapore')) {
      return { currency: 'SGD', country: 'Singapore' };
    }
  } catch {}
  return { currency: 'USD', country: 'United States' };
};
