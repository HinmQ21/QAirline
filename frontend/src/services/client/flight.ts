import { clientAxios } from '@/lib/axios/client';

const getFlightPaged = async (pageSize: number, pageNumber: number) => {
  const res = await clientAxios.get("flights/paged", {
    params: {
      pageSize,
      pageNumber,
    }
  });

  return res.data;
}

export const flightApiObject = { getFlightPaged: getFlightPaged };
