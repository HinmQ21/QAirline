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
import { Card } from "@/components/ui/card";
import { Edit, Calendar, Eye } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
          setIsSubmitting(false);
          updateNewsStateAction(data);
          return "Cập nhật bài viết thành công!";
        }
      }
    );
  }

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      {/* Header with Date and Category */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              {created_date.format("DD/MM/YYYY")}
            </span>
          </div>
          <NewsCategoryBadge category={news.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
          <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded overflow-hidden">
            <ReactMarkdown>
              {news.content.length > 150 ? news.content.slice(0, 150) + '...' : news.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>245 lượt xem</span>
            </div>
            <span>•</span>
            <span>ID: {news.news_id}</span>
          </div>
          <span>{created_date.format("HH:mm")}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <NewsWritingDialog
            open={open} setOpen={setOpen}
            newsForm={newsForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitText="Cập nhật"
          >
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
          </NewsWritingDialog>

          <DeleteNewsButton 
            news_id={news.news_id} 
            deleteNewsStateAction={deleteNewsStateAction}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
          />
        </div>
      </div>
    </Card>
  );
};

export const NewsCategoryBadge = ({ 
  category, 
  size = "default" 
}: { 
  category: NewsCategoryType;
  size?: "default" | "large";
}) => {
  let className;
  switch (category) {
    case "news": 
      className = "bg-blue-100 text-blue-800 hover:bg-blue-200"; 
      break;
    case "announcement": 
      className = "bg-red-100 text-red-800 hover:bg-red-200"; 
      break;
    case "introduction": 
      className = "bg-teal-100 text-teal-800 hover:bg-teal-200"; 
      break;
    case "promotion": 
      className = "bg-orange-100 text-orange-800 hover:bg-orange-200"; 
      break;
  }

  const sizeClasses = {
    default: "px-2 py-0.5 text-xs",
    large: "text-md px-3 py-1"
  };

  return (
    <Badge className={`${className} ${sizeClasses[size]} reddit-semibold`}>
      {newsCategoryLabels[category]}
    </Badge>
  );
}
