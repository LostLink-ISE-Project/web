import locationInterceptor from "@/api/locations/inceptor";
import type { CreateLocationDto, Location, UpdateLocationDto } from "@/api/locations/location.dto";

export async function getAllLocations(): Promise<Location[]> {
  const { data } = await locationInterceptor.get("");
  return data.data;
}

export async function getLocationById(id: number): Promise<Location> {
  const { data } = await locationInterceptor.get(`/${id}`);
  return data.data;
}

export async function createLocation(payload: CreateLocationDto): Promise<Location> {
  const { data } = await locationInterceptor.post("", payload);
  return data.data;
}

export async function updateLocation(id: number, payload: UpdateLocationDto): Promise<Location> {
  const { data } = await locationInterceptor.patch(`/${id}`, payload);
  return data.data;
}

export async function deleteLocation(id: number): Promise<void> {
  await locationInterceptor.delete(`/${id}`);
}
