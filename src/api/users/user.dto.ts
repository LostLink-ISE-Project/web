export interface User {
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

export interface CreateUserDto {
  name: string;
  surname: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  surname: string;
}
