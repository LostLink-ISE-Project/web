export interface Location {
  id: number;
  slug: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateLocationDto {
  slug: string;
  name: string;
  description: string;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;