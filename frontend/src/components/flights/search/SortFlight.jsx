import { LuPlaneTakeoff } from "react-icons/lu";
import { Dropdown } from "../../dropdown/Dropdown/Dropdown"
import { DropdownItem } from "../../dropdown/DropdownItem/DropdownItem";
import { useState, useEffect, use } from "react";

export const SortFlight = () => {
    const [buttonText, setButtonText] = useState("Mac Dinh");
    const sortOpt = [
        "Mac Dinh",
        "Khoi hanh som nhat",
        "Gia tot nhat",
    ];

    useEffect(() => {

    }, [buttonText]);

    
    return (
        <>
            <div className="flex justify-between">
                <button
                    className="w-24 h-14 flex items-center justify-center
                               bg-white rounded-xl border-1 border-gray-400 shadow-sm"
                >
                    {/* Icon  */}
                    <LuPlaneTakeoff className="w-4 h-4 mr-2" />
                    <p className="w-fit">Bo loc</p>
                </button>
                <div className="w-fit h-14 flex items-end justify-end">
                    <p className="mr-2">Sap xep theo</p>
                    <Dropdown buttonText={buttonText} content={
                        <>
                            {
                                sortOpt.map((item) =>  (
                                    <DropdownItem key={item} onClick={() => {
                                        setButtonText(item);
                                    }}>
                                        {item}
                                    </DropdownItem>
                                ))
                            }
                        </>
                    } />
                </div>
            </div>
        </>
    );
}