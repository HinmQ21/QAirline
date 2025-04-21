import { FlightRecap } from "./FlightRecap";


export const RoundTrip = () => {
    return (
        <div className="w-2/5 h-full border-r-2 px-4 flex-col justify-between">
            <FlightRecap />
        </div>
    );
}