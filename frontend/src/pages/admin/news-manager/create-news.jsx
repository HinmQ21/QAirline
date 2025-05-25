import { z } from "zod"
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { FaRegPenToSquare } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog, DialogDescription, DialogHeader,
  DialogContent, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { useForm } from "react-hook-form";

export const categoryLabels = {
  introduction: "Giới thiệu",
  promotion: "Khuyến mãi",
  news: "Tin tức",
  announcement: "Thông báo"
};

const newsSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  category: z.enum(Object.keys(categoryLabels))
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

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={`${className}`}>
          <p className="poppins-regular">Đăng bài viết mới</p>
          <FaRegPenToSquare />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inter-bold">Tạo bài viết mới</DialogTitle>
          <DialogDescription>{dayjs().format("[Today at] HH:mm")}</DialogDescription>
          <Form {...newsForm}>
            <form onSubmit={newsForm.handleSubmit(onSubmit)} className="space-y-4">
              {/* <FormField
                control={newsForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black inter-medium text-base">Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="thanhduc2k4" {...field} />
                    </FormControl>
                    <FormMessage className="poppins-regular" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black inter-medium text-base">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage className="poppins-regular" />
                  </FormItem>
                )}
              /> */}
              <div className="flex flex-row justify-between w-full">
                <DropdownSelect title="Danh mục" labelMap={categoryLabels} variant="link" />
                <Button type="submit" className="cursor-pointer">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
