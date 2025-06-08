import { z } from "zod";
import dayjs from '@/util/dayjs';
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { newsCategoryList } from "@/services/schemes/news";
import { newsCategoryLabels } from "@/services/schemes/news";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ReactNode, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const newsSchema = z.object({
  title: z.string()
    .nonempty("Tiêu đề không được để trống!")
    .max(75, "Tiêu đề không được dài quá 75 kí tự!"),
  content: z.string()
    .nonempty("Nội dung không được để trống!")
    .max(1000, "Nội dung không được dài quá 1000 kí tự!"),
  category: z.enum(newsCategoryList)
});

type NewsWritingDialogProps = {
  open?: boolean | undefined;
  setOpen?(open: boolean): void;
  isSubmitting?: boolean | undefined;
  newsForm: UseFormReturn<z.infer<typeof newsSchema>>;
  onSubmit?(values: z.infer<typeof newsSchema>): void;
  submitText: string;
  children: ReactNode;
}

export const NewsWritingDialog = ({
  open, setOpen, newsForm, onSubmit,
  isSubmitting, children, submitText
}: NewsWritingDialogProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <Form {...newsForm}>
            <form onSubmit={onSubmit ? newsForm.handleSubmit(onSubmit) : undefined}>
              <DialogTitle>
                <FormField
                  control={newsForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Tiêu đề" {...field}
                          className="inter-bold text-gray-900
                              border-none shadow-none focus-visible:ring-0
                              p-0 text-2xl md:text-2xl max-w-[80%]
                            "
                        />
                      </FormControl>
                      <div className="relative bottom-1">
                        <FormDescription className="reddit-medium absolute">{
                          dayjs().format("[Today at] HH:mm")
                        }</FormDescription>
                        <FormMessage className="reddit-regular relative left-30" />
                      </div>
                    </FormItem>
                  )}
                />
              </DialogTitle>
              <div className="py-5">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                    <TabsTrigger value="preview">Xem trước</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <FormField
                      control={newsForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Nội dung bài viết" {...field}
                              className="inter-regular text-gray-950
                                border border-input rounded-md p-4
                                resize-none overflow-hidden h-auto min-h-[300px]
                                focus-visible:ring-1 focus-visible:ring-ring
                              " onInput={(e) => {
                                const el = e.currentTarget;
                                el.style.height = "auto";
                                el.style.height = el.scrollHeight + "px";
                              }}
                            />
                          </FormControl>
                          <div className="flex justify-between items-center mt-2">
                            <FormDescription className="reddit-medium">
                              {`${field.value.length}/1000 ký tự`}
                            </FormDescription>
                            <FormMessage className="reddit-regular" />
                          </div>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>
                          {newsForm.watch("content")}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex flex-row justify-between w-full">
                <FormField
                  control={newsForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center">
                        <FormControl>
                          <DropdownSelect title="Danh mục"
                            labelMap={newsCategoryLabels} variant="link"
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}