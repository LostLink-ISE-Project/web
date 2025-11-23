// DTOs for Items

export type ItemStatus = 'SUBMITTED' | 'LISTED' | 'CLAIMED' | 'ARCHIVED';

export interface ItemResponse {
  id: number;
  itemName: string;
  itemDescription: string;
  foundLocation: string;
  givenLocation:
    | string
    | {
        name: string;
        location: string;
        workHours: string;
      };
  image: string;
  itemStatus: ItemStatus;
  createdDate: string;
  category: string;
  submitterEmail: string;
}

export interface CreateItemDto {
  itemName: string;
  itemDescription: string;
  foundLocation: string;
  submitterEmail: string;
  image: string;
  givenLocation: string;
  category: string;
}

export interface UpdateItemStatusDto {
  status: ItemStatus;
  description?: string;
}
