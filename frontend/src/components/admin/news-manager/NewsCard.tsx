import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import { NewsCategoryBadge } from "./NewsList";
import { NewsType, updateNews } from "@/services/admin/news";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { newsSchema, NewsWritingDialog } from "./NewsWritingDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type NewsCardProps = {
  news: NewsType;
  updateNewsStateAction: (news: NewsType) => void;
  deleteNewsStateAction: (news_id: number) => void;
}

export const NewsCard = ({
  news,
  updateNewsStateAction,
  deleteNewsStateAction
}: NewsCardProps) => {
  const created_date = dayjs(news.created_at);
  const newsForm = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: news.title,
      content: news.content,
      category: news.category
    },
  });

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values: z.infer<typeof newsSchema>) => {
    setIsSubmitting(true);
    toast.promise(
      updateNews(news.news_id, values),
      {
        loading: "Đang cập nhật bài viết",
        error: (err) => {
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsSubmitting(false);
          return `Lỗi khi cập nhật bài viết: ${errMsg}`;
        },
        success: (data) => {
          console.log(data);
          setOpen(false);
          // not reseting, we keep the latest data
          // newsForm.reset();
          setIsSubmitting(false);
          updateNewsStateAction(data);
          return "Cập nhật bài viết thành công!";
        }
      }
    );
  }

  return (
    <div className="
      flex flex-row items-center justify-between
      h-18 w-120 bg-white rounded-xl
      hover:shadow-2xl transition-all duration-300
      cursor-pointer
    ">

      <Tooltip>
        <TooltipTrigger asChild>
          <NewsWritingDialog
            open={open} setOpen={setOpen}
            newsForm={newsForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitText="Cập nhật"
          >
            <div className="flex flex-row h-full items-center">
              <div className="
                flex flex-col ml-3 items-center justify-center
                text-gray-900 montserrat-medium w-13
              ">
                <p className="text-sm">
                  {created_date.format("MMM D")}
                </p>
                <p className="text-md">
                  {created_date.format("YYYY")}
                </p>
              </div>
              <div className="w-0.5 h-[60%] bg-gray-600 mx-3" />
              <div className="
                flex flex-col justify-center
                text-gray-900 w-60
              ">
                <p className="text-xl montserrat-semibold truncate">
                  {news.title}
                </p>
                <p className="text-xs montserrat-medium truncate">
                  {news.content}
                </p>
              </div>
            </div>
          </NewsWritingDialog>
        </TooltipTrigger>
        <TooltipContent>
          {`ID: ${news.news_id}`}
        </TooltipContent>
      </Tooltip>

      <div className="flex flex-row h-full items-center">
        <NewsCategoryBadge category={news.category} />
        <div className="ml-3 w-0.5 h-[60%] bg-gray-600" />
        <DeleteNewsButton news_id={news.news_id} deleteNewsStateAction={deleteNewsStateAction} />
      </div>
    </div>
  );
};
