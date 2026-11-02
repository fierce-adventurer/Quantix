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

export const detectCurrencyFromCoordinates = (lat: number, lon: number): { currency: string; country: string } => {
  if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
    return { currency: 'INR', country: 'India' };
  }
  if (lat >= 49 && lat <= 61 && lon >= -8 && lon <= 2) {
    return { currency: 'GBP', country: 'United Kingdom' };
  }
  if (lat >= 24 && lat <= 46 && lon >= 122 && lon <= 154) {
    return { currency: 'JPY', country: 'Japan' };
  }
  if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) {
    return { currency: 'AUD', country: 'Australia' };
  }
  if (lat >= 42 && lat <= 83 && lon >= -141 && lon <= -52) {
    return { currency: 'CAD', country: 'Canada' };
  }
  if (lat >= 22 && lat <= 27 && lon >= 51 && lon <= 57) {
    return { currency: 'AED', country: 'United Arab Emirates' };
  }
  if (lat >= 1.1 && lat <= 1.5 && lon >= 103.6 && lon <= 104.1) {
    return { currency: 'SGD', country: 'Singapore' };
  }
  if (lat >= 45.8 && lat <= 47.8 && lon >= 5.9 && lon <= 10.5) {
    return { currency: 'CHF', country: 'Switzerland' };
  }
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 35) {
    return { currency: 'EUR', country: 'European Union' };
  }
  if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) {
    return { currency: 'USD', country: 'United States' };
  }
  return detectLocationCurrency();
};

export const requestLocationPermissionAndDetectCurrency = (): Promise<{ currency: string; country: string; granted: boolean }> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      const fallback = detectLocationCurrency();
      localStorage.setItem('quantix_store_currency', fallback.currency);
      localStorage.setItem('quantix_user_country', fallback.country);
      resolve({ ...fallback, granted: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detected = detectCurrencyFromCoordinates(pos.coords.latitude, pos.coords.longitude);
        localStorage.setItem('quantix_store_currency', detected.currency);
        localStorage.setItem('quantix_user_country', detected.country);
        resolve({ ...detected, granted: true });
      },
      () => {
        const fallback = detectLocationCurrency();
        localStorage.setItem('quantix_store_currency', fallback.currency);
        localStorage.setItem('quantix_user_country', fallback.country);
        resolve({ ...fallback, granted: false });
      },
      { timeout: 6000, enableHighAccuracy: false }
    );
  });
};

export const getStoredStoreCurrency = (): string => {
  if (typeof window === 'undefined') return 'USD';
  return localStorage.getItem('quantix_store_currency') || 'USD';
};

export interface StockMovement {
  id: string;
  productId: string;
  previousQuantity: number;
  quantityDelta: number;
  resultingQuantity: number;
  reason: string;
  adjustedBy?: string;
  createdAt: string;
}

export interface AdjustStockInput {
  quantityDelta: number;
  reason: string;
}
