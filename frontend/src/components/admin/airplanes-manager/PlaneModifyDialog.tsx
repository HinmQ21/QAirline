import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { manufacturerList } from "@/services/admin/planes";
import { ReactNode } from "react"
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const planeSchema = z.object({
  code: z.string().nonempty(),
  manufacturer: z.enum(manufacturerList),
  model: z.string().nonempty(),
  total_seats: z.number().positive(),
});


type PlaneModifyDialogProps = {
  open?: boolean | undefined;
  setOpen?(open: boolean): void;
  isSubmitting?: boolean | undefined;
  planeForm: UseFormReturn<z.infer<typeof planeSchema>>;
  onSubmit?(values: z.infer<typeof planeSchema>): void;
  submitText: string;
  children: ReactNode;
}

export const PlaneModifyDialog = ({
  open, setOpen, planeForm, onSubmit,
  isSubmitting, children, submitText
}: PlaneModifyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
    </Dialog>
  );
}