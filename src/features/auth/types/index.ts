export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}
