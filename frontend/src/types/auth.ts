export interface User {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export interface AuthResponseData {
  token: string | null;
  user: User;
  tenant: Tenant;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: Record<string, string> | string | null;
}
