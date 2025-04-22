import { LuPlaneTakeoff } from "react-icons/lu";

export const RecapCode = ({from, to, roundtrip}) => {
    return(
        <>
            <div className="w-2/10 h-fit
                          text-white text-xl inter-extrabold">{from}</div>
            <div className="w-6/10 h-full flex flex-col">
                {roundtrip ? (
                    <>
                        <div className="w-full h-1/2 flex justify-center items-center ">
                            <div className="text-white font-bold text-lg ">. . . . . . .</div>
                            <div className="ml-1 w-1/10 h-1/2">
                                <LuPlaneTakeoff className="text-white" />
                            </div>
                        </div>
                        <div className="w-full h-1/2 flex justify-center items-center">
                            <div className="mr-1 w-1/10 h-1/2">
                                <LuPlaneTakeoff className="text-white" />
                            </div>
                            <div className="text-white font-bold text-lg ">. . . . . . .</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full h-full flex justify-center items-center ">
                            <div className="text-white font-bold text-lg ">. . . . . . .</div>
                            <div className="ml-1 w-1/10 h-1/2">
                                <LuPlaneTakeoff className="text-white" />
                            </div>
                        </div>
                    </>
                )}               
            </div>
            <div className="w-2/10 h-fit
                          text-white text-xl inter-extrabold">{to}</div>
        </>
    );
}