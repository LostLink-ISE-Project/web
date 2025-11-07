import officeInterceptor from "@/api/office/inteceptor";
import type { Office, CreateOfficeDto, UpdateOfficeDto } from "@/api/office/office.dto";

export async function getAllOffices(): Promise<Office[]> {
  const { data } = await officeInterceptor.get("/");
  return data.data;
}

export async function getOfficeById(id: number): Promise<Office> {
  const { data } = await officeInterceptor.get(`/${id}`);
  return data.data;
}

export async function createOffice(payload: CreateOfficeDto): Promise<Office> {
  const { data } = await officeInterceptor.post("/", payload);
  return data.data;
}

export async function updateOffice(id: number, payload: UpdateOfficeDto): Promise<Office> {
  const { data } = await officeInterceptor.patch(`/${id}`, payload);
  return data.data;
}

export async function deleteOffice(id: number): Promise<void> {
  await officeInterceptor.delete(`/${id}`);
}
