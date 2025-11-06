export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface MeResponse {
  id: number;
  profilePhoto: string;
  name: string;
  surname: string;
  username: string;
  password: string;
  status: "ACTIVE" | "DISABLED";
  createdDate: string;
  updatedDate: string;
}

export interface UpdateMeDto {
  name?: string;
  surname?: string;
  profilePhoto?: string;
}

export interface ResetPasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
