import { clientAxios } from "@/lib/axios/client"
import { GetAirportRequest } from "../schemes/airport"


const getAirportList = async (params: {
    code: string,
    name: string,
    city: string,
    country: string,
  }): Promise<GetAirportRequest> => {
    return (await clientAxios.get("airports", { params })).data.data;
  };

  export const airportApiObject = { getAirportList: getAirportList };