//Textinput co controller track lai value
//Viet cai nay lai thanh component tot hon dung duoc ca cho trang khac
//hoan thien giao dien newSearch
//them tinh nang querry cho new Search: Nhap ten vao co the tim kiem duoc
// dau tien la tim theo ten san bay, neu co hien thi, neu khong co tim theo ten thanh pho, neu khong co tim theo tne quoc gia
// neu van khong thay thi ko hien

//Muc tieu la chay duoc va nhanh nhat co the
// Xoa bot - don
// Thay cai search
// search moi cai dat duoc
// Cho phep tuy chinh
// placeholder
// Icon - oke- chuc nang truoc
// vaule nua truyen tu parent cha main page --> (tamthoi)FightSearch --> SearchInput : oke
// string cho phep style: width, height, bgColor, border, borderRadius,
// theme sang hoac toi - cho phep chon

// Truyen vao cac gia tri co the thay doi theo theme duoc
// bg CommandItem
// Text trong commendItem
// Hover cua no -- chua chinh duoc --> Chot sang theme Trang slove

// State cho may bay den va May bay di -> Truyen vao tu parrent --> Xong chuc nang nay roi
// Xoa cai value thua



import React from 'react';
import { 
  useState,
} from "react";

import { SearchInput } from "./SearchInput"

import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { ChevronsUpDown } from "lucide-react"


export const SearchFlight = ({startAirport, setStartAirport, endAirport, setEndAirport}) => {
  const [data, setData] = useState(null);

  return (
    <>
      <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full ">
        <SearchInput
          data={data}
          setData={setData}
          placeholder="Start"
          Icon={LuPlaneTakeoff}
          value={startAirport}
          setValue={setStartAirport}
          layout="m-2 w-80 h-10 border border-gray-300 rounded bg-white p-2 flex flex-row"
          
        />

        <SearchInput
          data={data}
          setData={setData}
          placeholder="End"
          Icon={LuPlaneTakeoff}
          value={endAirport}
          setValue={setEndAirport}
          layout="m-2 w-80 h-10 border border-gray-300 rounded p-2 flex flex-row text-black"
        />        
      </div>
    </>
  );
}