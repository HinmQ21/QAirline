import { RecapCode } from "../RecapCode";
import { RecapDate } from "../RecapDate";

export const FlightRecap = ({ from, to, roundtrip, start, end, passanger }) => {
  return (
    <>
      {/* RecapCode */}
      <div className="w-2/5 h-full px-4 flex flex-col justify-between 
                            border-r-2 border-white">
        <div className="w-full h-4/10 flex justify-between items-center">
          <RecapCode from={from.code} to={to.code} roundtrip={roundtrip} />
        </div>

        <div className="w-full h-4/10 flex justify-between items-start">
          <p className="inter-regular text-white">{from.city}</p>
          <p className="inter-regular text-white">{to.city}</p>
        </div>
      </div>
      {/* RecapDate */}
      <RecapDate start={start} end={end} roundtrip={roundtrip} />

      {/* PassangerRecap */}
      <div className="w-1/4 h-full px-2 flex flex-col justify-between
                            border-r-2 border-white">
        <p className="inter-regular text-white">Hành khách</p>
        <p className="inter-regular text-white">{passanger}</p>
      </div>


    </>

  );
}