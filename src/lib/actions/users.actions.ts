import userInterceptor from "@/api/users/inceptor";
import type { CreateUserDto, UpdateUserDto, User } from "@/api/users/user.dto";


export async function getAllUsers(): Promise<User[]> {
  const { data } = await userInterceptor.get("");
  return data.data;
}

export async function createUser(payload: CreateUserDto): Promise<User> {
  const { data } = await userInterceptor.post("", payload);
  return data.data;
}

export async function updateUser(id: number, payload: UpdateUserDto): Promise<User> {
  const { data } = await userInterceptor.patch(`/${id}`, payload);
  return data.data;
}

export async function disableUser(id: number): Promise<void> {
  await userInterceptor.patch(`/disable/${id}`);
}
