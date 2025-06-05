import { z } from "zod";
import dayjs from '@/util/dayjs';
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { adminApi } from "@/services/admin/main";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, NewsWritingDialog } from "./NewsWritingDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { newsCategoryLabels, NewsCategoryType, NewsType } from "@/services/schemes/news";
import { Badge } from "@/components/ui/badge";

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
      adminApi.updateNews(news.news_id, values),
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="
          flex flex-row items-center justify-between
          h-18 w-120 bg-white rounded-xl
          hover:shadow-2xl transition-all duration-300
          cursor-pointer
        ">
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
                <p className="text-lg montserrat-semibold truncate">
                  {news.title}
                </p>
                <p className="text-[11px] montserrat-medium truncate">
                  {news.content}
                </p>
              </div>
            </div>
          </NewsWritingDialog>

          <div className="flex flex-row h-full items-center">
            <NewsCategoryBadge category={news.category} />
            <div className="ml-3 w-0.5 h-[60%] bg-gray-600" />
            <DeleteNewsButton news_id={news.news_id} deleteNewsStateAction={deleteNewsStateAction} />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        {`ID: ${news.news_id}`}
      </TooltipContent>
    </Tooltip>
  );
};

export const NewsCategoryBadge = ({ category }: { category: NewsCategoryType }) => {
  let className;
  switch (category) {
    case "news": className = "bg-slate-500 hover:bg-slate-400"; break;
    case "announcement": className = "bg-red-500 hover:bg-red-400"; break;
    case "introduction": className = "bg-cyan-600 hover:bg-cyan-500"; break;
    case "promotion": className = "bg-orange-500 hover:bg-orange-400"; break;
  }
  return <Badge className={`${className}`}>{newsCategoryLabels[category]}</Badge>
}
