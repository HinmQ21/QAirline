import { z } from "zod";
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { ReactNode } from "react"
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { manufacturerList } from "@/services/schemes/planes";
import { manufacturerLabels } from "@/services/schemes/planes";
import { DropdownSelect } from "@/components/misc/DropdownSelect";

export const planeSchema = z.object({
  code: z.string().nonempty().max(20),
  manufacturer: z.enum(manufacturerList),
  model: z.string().nonempty().max(50),
  total_seats: z.number().positive().min(1, "Số ghế ngồi phải lớn hơn 0"),
});


type PlaneModifyDialogProps = {
  dialogTitle: string;
  open?: boolean | undefined;
  setOpen?(open: boolean): void;
  isSubmitting?: boolean | undefined;
  planeForm: UseFormReturn<z.infer<typeof planeSchema>>;
  airplaneId?: number | undefined;
  onSubmit?(values: z.infer<typeof planeSchema>): void;
  submitText: string;
  children: ReactNode;
}

export const PlaneModifyDialog = ({
  dialogTitle, open, setOpen, planeForm, onSubmit,
  airplaneId, isSubmitting, children, submitText
}: PlaneModifyDialogProps) => {
  const formLabelClassName = "text-black inter-medium";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Form {...planeForm}>
          <form onSubmit={onSubmit ? planeForm.handleSubmit(onSubmit) : undefined} className="space-y-4">
            <FormField
              control={planeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={formLabelClassName}>Codename</FormLabel>
                  <FormControl>
                    <Input placeholder="CI-A333-001" {...field} />
                  </FormControl>
                  <FormMessage className="reddit-regular" />
                </FormItem>
              )}
            />
            <FormField
              control={planeForm.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={formLabelClassName}>Mẫu máy bay</FormLabel>
                  <FormControl>
                    <Input placeholder="A330-300" {...field} />
                  </FormControl>
                  <FormMessage className="reddit-regular" />
                </FormItem>
              )}
            />
            <FormField
              control={planeForm.control}
              name="total_seats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={formLabelClassName}>Số ghế ngồi</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : parseInt(value, 10) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="reddit-regular" />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between w-full">
              <FormField
                control={planeForm.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center">
                      <FormControl>
                        <DropdownSelect title="Nhà sản xuất"
                          labelMap={manufacturerLabels} variant="link"
                          value={field.value} setValue={field.onChange}
                          className="px-0"
                        />
                      </FormControl>
                      <FormMessage className="reddit-regular text-sm" />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>{submitText}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
