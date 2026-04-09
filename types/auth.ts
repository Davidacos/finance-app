export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  monthly_budget?: number;
  currency_code?: string;
  language?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: any[];
  errorCode?: string;
}
