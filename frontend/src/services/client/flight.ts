import { api } from '@/lib/axios/client';

export const getFlightPaged = async (pageSize: number, pageNumber: number) => {
  const res = await api.get("flights/paged", {
    params: {
      pageSize,
      pageNumber,
    }
  });

  return res.data;
}

