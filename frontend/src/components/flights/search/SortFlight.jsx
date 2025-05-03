import { LuPlaneTakeoff } from "react-icons/lu";
import { useState, useEffect, use } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const SortFlight = ({sortOption, onSortChange}) => {
    

    
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
                      <DropdownMenuTrigger className="cursor-pointer hover:text-red-700">{sortOption}</DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                        <DropdownMenuRadioGroup value={sortOption} onValueChange={onSortChange}>
                          <DropdownMenuRadioItem value="Mac Dinh">Mac Dinh</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Gia tot nhat">Gia tot nhat</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Khoi hanh som nhat">Khoi hanh som nhat</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>               
                      </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </>
    );
}