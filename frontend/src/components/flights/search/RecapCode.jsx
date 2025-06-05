import { LuPlaneTakeoff } from "react-icons/lu";

export const RecapCode = ({from, to, roundtrip}) => {
    return(
      <>
        <div className="w-2/10 h-fit text-white text-xl inter-extrabold text-left">{from}</div>
        <div className="w-6/10 h-full flex flex-col">
          {roundtrip ? (
            <>
              <div className="w-full h-1/2 flex justify-center items-center ">
              </div>
              <div className="w-full h-1/2 flex justify-center items-center">
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center ">
              </div>
            </>
          )}               
        </div>
        <div className="w-2/10 h-fit text-white text-xl inter-extrabold text-right">{to}</div>
      </>
    );
}