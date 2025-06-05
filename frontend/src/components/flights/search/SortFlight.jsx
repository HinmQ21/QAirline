import { css } from "@/css/styles";
import { LuPlaneTakeoff } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const SortFlight = ({ sortOption, onSortChange }) => {
  return (
    <>
      <div className="flex w-full justify-around">
        <button
          className="w-24 h-10 flex items-center justify-center
                               bg-white rounded-xl border-1 border-gray-400 shadow-sm"
        >
          {/* Icon  */}
          <LuPlaneTakeoff className="w-4 h-4 mr-2" />
          <p className="w-fit">Bo loc</p>
        </button>


        <div className={`${css.minipage.xl} flex flex-col justify-center h-10`}>
          <div className="flex flex-row mx-4">
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
              <DropdownMenuContent className="">
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
      </div>
    </>
  );
}