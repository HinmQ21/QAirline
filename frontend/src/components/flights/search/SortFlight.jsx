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
          <p className="w-fit">Bộ lọc</p>
        </button>


        <div className={`${css.minipage.xl} flex flex-col justify-center h-10`}>
          <div className="flex flex-row mx-4">
            <p className="mr-2">Sắp xếp theo</p>
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
                  <DropdownMenuRadioItem value="Mặc định">Mặc định</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Giá tốt nhất">Giá tốt nhất</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Khởi hành sớm nhất">Khởi hành sớm nhất</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}