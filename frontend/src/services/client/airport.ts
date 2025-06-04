import { clientAxios } from "@/lib/axios/client"


const getAirportList = async (params: {
    code: string,
    name: string,
    city: string,
    country: string,
  }): Promise<any> => {
    return (await clientAxios.get("airports", { params })).data.data;
  };

  export const airportApiObject = { getAirportList: getAirportList };