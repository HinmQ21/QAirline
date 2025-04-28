import { LuPlaneTakeoff } from "react-icons/lu";
import { Dropdown, DropdownItem } from "../../dropdown/Dropdown/Dropdown"
import { useState, useEffect, use } from "react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                <div className="w-fit h-14 flex items-end justify-end z-10">
                    <p className="mr-2">Sap xep theo</p>
                    {/* <Dropdown buttonText={buttonText} content={
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
                    }/> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </>
    );
}