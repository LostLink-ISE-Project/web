import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import itemInterceptor from './inceptor';
import type { CreateItemDto, ItemResponse, UpdateItemStatusDto, ItemStatus } from './item.dto';

// GET all items
export function useItems(full: boolean, status?: ItemStatus) {
  return useQuery<ItemResponse[]>({
    queryKey: ['items', full, status],
    queryFn: async () => {
      const { data } = await itemInterceptor.get('', {
        params: { full, status },
      });
      return data.data;
    },
  });
}

// GET item by ID
export function useItem(id?: number) {
  return useQuery<ItemResponse>({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data } = await itemInterceptor.get(`/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// CREATE item
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateItemDto): Promise<ItemResponse> => {
      const { data } = await itemInterceptor.post('', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// DELETE item
export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const { data } = await itemInterceptor.delete(`/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

// PATCH item status
export function useUpdateItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateItemStatusDto;
    }): Promise<void> => {
      const { data } = await itemInterceptor.patch(`/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });
}
