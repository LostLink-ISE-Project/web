export interface Office {
  id: number;
  name: string;
  location: string;
  workHours: string;
  contact: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOfficeDto {
  name: string;
  location: string;
  workHours: string;
  contact: string;
}

export type UpdateOfficeDto = Partial<CreateOfficeDto>;
