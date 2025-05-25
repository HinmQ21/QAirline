import {
  DropdownMenuTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuContent, DropdownMenu
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DropdownSelect = ({ title, labelMap, value, setValue, variant = "outline", className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={`${className}`}>
          <p className="poppins-regular">{title}:</p>
          <p className="text-indigo-700 poppins-semibold">{labelMap[value]}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>{
          Object.entries(labelMap).map(([value, label]) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))
        }</DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}