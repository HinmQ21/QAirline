import { z } from "zod"
import dayjs from "dayjs";
import {
  DialogHeader, DialogContent,
  Dialog, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormField, FormItem, FormMessage,
  Form, FormControl, FormDescription,
} from "@/components/ui/form"
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod"
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { createNews, newsCategoryList, newsCategoryLabels, NewsType } from "@/services/admin/news";

const newsSchema = z.object({
  title: z.string()
    .nonempty("Tiêu đề không được để trống!")
    .max(50, "Tiêu đề không được dài quá 50 kí tự!"),
  content: z.string()
    .nonempty("Nội dung không được để trống!")
    .max(1000, "Nội dung không được dài quá 1000 kí tự!"),
  category: z.enum(newsCategoryList)
});

type CreateNewsButtonProps = {
  className?: string | undefined;
  createNewsStateAction: (news: NewsType) => void
}

export const CreateNewsButton = ({ className, createNewsStateAction }: CreateNewsButtonProps) => {
  const newsForm = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "news"
    },
  });

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values: z.infer<typeof newsSchema>) => {
    setIsSubmitting(true);
    toast.promise(
      createNews(values),
      {
        loading: "Đang tạo bài viết",
        error: (err) => {
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsSubmitting(false);
          return `Lỗi khi tạo bài viết: ${errMsg}`;
        },
        success: (data) => {
          console.log(data);
          setOpen(false);
          newsForm.reset();
          setIsSubmitting(false);
          createNewsStateAction(data);
          return "Tạo bài viết thành công!";
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`${className}`}>
          <p className="poppins-regular">Đăng bài viết mới</p>
          <FaRegPenToSquare />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...newsForm}>
            <form onSubmit={newsForm.handleSubmit(onSubmit)}>
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
                      <div className="relative bottom-1.5">
                        <FormDescription className="poppins-medium absolute">{
                          dayjs().format("[Today at] HH:mm")
                        }</FormDescription>
                        <FormMessage className="poppins-regular relative left-30" />
                      </div>
                    </FormItem>
                  )}
                />
              </DialogTitle>
              <div className="py-5">
                <FormField
                  control={newsForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Nội dung bài viết" {...field}
                          className="inter-regular text-gray-950
                            border-none shadow-none focus-visible:ring-0 p-0
                            resize-none overflow-hidden h-auto rounded-none
                          " rows={5} onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = el.scrollHeight + "px";
                          }}
                        />
                      </FormControl>
                      <div>
                        <FormDescription className="poppins-medium absolute">{
                          `${field.value.length}/1000`
                        }</FormDescription>
                        <FormMessage className="poppins-regular relative left-30" />
                      </div>
                    </FormItem>
                  )}
                />
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
                        <FormMessage className="poppins-regular text-sm" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
