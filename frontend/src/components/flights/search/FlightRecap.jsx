import { LuPlaneTakeoff } from "react-icons/lu";


export const FlightRecap = () => {
    return (
        <>
            <div className="w-full h-4/10 mb-3 flex flex-row justify-between items-center">
                <div className="w-2/10 h-fit text-white font-bold text-xl">HAN</div>
                <div className="w-6/10 h-full outline-white flex flex-col">
                    <div className="w-full h-1/2 flex flex-row justify-center items-center ">
                        <div className="text-white font-bold text-lg ">. . . . . . .</div>
                        <div className="ml-1 w-1/10 h-1/2"><LuPlaneTakeoff className="text-white" /></div>
                    </div>
                    <div className="w-full h-1/2 flex flex-row justify-center items-center">
                        <div className="mr-1 w-1/10 h-1/2"><LuPlaneTakeoff className="text-white" /></div>
                        <div className="text-white font-bold text-lg ">. . . . . . .</div>
                    </div>

                </div>
                <div className="w-2/10 h-fit text-white font-bold text-xl">SGN</div>
            </div>

            <div className="w-full h-4/10 mt-3">

            </div>
        </>
    );
}