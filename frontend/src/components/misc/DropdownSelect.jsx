import {
  DropdownMenuTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuContent, DropdownMenu
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DropdownSelect = ({ title, labelMap, item, setItem }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <p className="poppins-regular">{title}:</p>
        <p className="text-indigo-700 poppins-semibold">{labelMap[item]}</p>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup value={item} onValueChange={setItem}>{
        Object.entries(labelMap).map(([value, label]) => (
          <DropdownMenuRadioItem key={value} value={value}>
            {label}
          </DropdownMenuRadioItem>
        ))
      }</DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);