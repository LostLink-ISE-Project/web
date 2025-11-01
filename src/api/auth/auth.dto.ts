export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}