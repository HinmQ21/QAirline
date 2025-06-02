import { z } from "zod"
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { newsSchema, NewsWritingDialog } from "./NewsWritingDialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { createNews, NewsType } from "@/services/admin/news";

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
    <NewsWritingDialog
      className={className}
      open={open} setOpen={setOpen}
      newsForm={newsForm} onSubmit={onSubmit}
      isSubmitting={isSubmitting} 
    />
  );
};
