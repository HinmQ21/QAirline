import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react"

type PlaneModifyDialogProps = {
  open?: boolean | undefined;
  setOpen?(open: boolean): void;
  isSubmitting?: boolean | undefined;
  children: ReactNode;
}

export const PlaneModifyDialog = ({ open, setOpen, isSubmitting, children }: PlaneModifyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
    </Dialog>
  );
}