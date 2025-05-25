import { z } from "zod"
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog, DialogDescription, DialogHeader,
  DialogContent, DialogTitle, DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import toast from "react-hot-toast";
import { createNews } from "@/services/admin/news";

export const categoryLabels = {
  introduction: "Giới thiệu",
  promotion: "Khuyến mãi",
  news: "Tin tức",
  announcement: "Thông báo"
};

const newsSchema = z.object({
  title: z.string()
    .nonempty("Tiêu đề không được để trống!")
    .max(50, "Tiêu đề không được dài quá 50 kí tự!"),
  content: z.string()
    .nonempty("Nội dung không được để trống!")
    .max(1000, "Nội dung không được dài quá 1000 kí tự!"),
  category: z.string().nonempty("Vui lòng chọn một danh mục!")
});

export const CreateNewsButton = ({ className }) => {
  const newsForm = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      category: ""
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = (values) => {
    toast.promise(
      createNews(values),
      {
        loading: "Đang tạo bài viết",
        error: (err) => {
          const res = err.response;
          let errMsg;
          try {
            errMsg = res.data.message;
          }
          catch (_) {
            errMsg = res.toString();
          }
          return `Lỗi khi tạo bài viết: ${errMsg}`;
        },
        success: (data) => {
          console.log(data);
          setOpen(false);
          newsForm.reset();
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
                            labelMap={categoryLabels} variant="link"
                            value={field.value} setValue={field.onChange}
                            className="px-0"
                          />
                        </FormControl>
                        <FormMessage className="poppins-regular text-sm" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit">
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
