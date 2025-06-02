import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import Skeleton from 'react-loading-skeleton';
import { Button } from "@/components/ui/button";
import {
  DialogFooter, DialogContent, DialogDescription,
  Dialog, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";
import { deleteNews, newsCategoryLabels, NewsCategoryType, NewsType } from "@/services/admin/news";

const NewsCategoryBadge = ({ category }: { category: NewsCategoryType }) => {
  let className;
  switch (category) {
    case "news": className = "bg-slate-500 hover:bg-slate-400"; break;
    case "announcement": className = "bg-red-500 hover:bg-red-400"; break;
    case "introduction": className = "bg-cyan-600 hover:bg-cyan-500"; break;
    case "promotion": className = "bg-orange-500 hover:bg-orange-400"; break;
  }
  return <Badge className={`${className}`}>{newsCategoryLabels[category]}</Badge>
}

type NewsListProps = {
  isLoading: boolean;
  newsList: NewsType[];
  deleteNewsStateAction: (news_id: number) => void;
}

export const NewsList = ({ isLoading, newsList, deleteNewsStateAction }: NewsListProps) => {
  if (isLoading === false && newsList.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-900">
        Our search engine is superlative, but no result apparently!
      </p>
    );
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-4">{
      isLoading ? (
        Array(8).fill(0).map((_, i) => <NewsCardSkeleton key={i} />)
      ) : (
        newsList.map((e) => <NewsCard key={e.news_id} news={e} deleteNewsStateAction={deleteNewsStateAction} />)
      )
    }</div>
  );
}

type NewsCardProps = {
  news: NewsType;
  deleteNewsStateAction: (news_id: number) => void;
}

const NewsCard = ({ news, deleteNewsStateAction }: NewsCardProps) => {
  const created_date = dayjs(news.created_at);

  return (
    <div className="
      flex flex-row items-center justify-between
      h-18 w-120 bg-white rounded-xl
      hover:shadow-2xl transition-all duration-300
    ">
      <div className="flex flex-row h-full items-center">
        <div className="
                flex flex-col ml-3 items-center justify-center
                text-gray-900 montserrat-medium
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
      <div className="flex flex-row h-full items-center">
        <NewsCategoryBadge category={news.category} />
        <div className="ml-3 w-0.5 h-[60%] bg-gray-600" />
        <DeleteNewsButton news_id={news.news_id} deleteNewsStateAction={deleteNewsStateAction} />
      </div>
    </div >
  );
};

const NewsCardSkeleton = () => {
  return (
    <div className="flex flex-row h-18 w-120 bg-white rounded-xl items-center justify-between p-3">
      <div className="flex flex-row h-full items-center">
        {/* Ngày tháng */}
        <div className="flex flex-col items-center justify-center text-gray-900">
          <Skeleton height={16} width={40} />
          <Skeleton height={16} width={50} style={{ marginTop: '4px' }} />
        </div>

        {/* Divider */}
        <div className="w-0.5 h-[60%] bg-gray-400 mx-3" />

        {/* Title & content */}
        <div className="flex flex-col justify-center w-60">
          <Skeleton height={20} width="100%" />
          <Skeleton height={12} width="80%" style={{ marginTop: '4px' }} />
        </div>
      </div>

      <div className="flex flex-row h-full items-center">
        {/* Badge giả */}
        <Skeleton height={24} width={60} borderRadius={12} />

        {/* Divider */}
        <div className="ml-3 w-0.5 h-[60%] bg-gray-400" />

        {/* Delete button giả */}
        <Skeleton height={32} width={32} borderRadius={8} style={{ marginLeft: '12px' }} />
      </div>
    </div>
  );
};

type DeleteNewsButtonProps = {
  news_id: number;
  deleteNewsStateAction: (news_id: number) => void;
}

export const DeleteNewsButton = (
  { news_id, deleteNewsStateAction }: DeleteNewsButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteEvent = () => {
    setIsDeleting(true);
    toast.promise(
      deleteNews(news_id),
      {
        loading: "Đang xóa bài viết",
        error: (err) => {
          const res = err.response;
          let errMsg;
          try { errMsg = res.data.message; }
          catch (_) { errMsg = res.toString(); }
          setIsDeleting(false);
          return `Lỗi khi xóa bài viết: ${errMsg}`;
        },
        success: (_) => {
          setOpen(false);
          setIsDeleting(false);
          deleteNewsStateAction(news_id);
          return "Xóa bài viết thành công!";
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="
                    w-9 relative h-full text-red-600
                    flex flex-row items-center justify-center
                  ">
          <AiOutlineDelete size={20} className="absolute cursor-pointer
                      opacity-100 hover:opacity-0 transition-all duration-200" />
          <AiFillDelete size={20} className="absolute cursor-pointer
                      opacity-0 hover:opacity-100 transition-all duration-200" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bài viết này?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Bạn không thể hoàn tác thao tác xóa này!
        </DialogDescription>
        <DialogFooter>
          <Button className="bg-gray-900 hover:bg-gray-700
            cursor-pointer px-3 py-2 text-white rounded-lg"
            disabled={isDeleting} onClick={() => setOpen(false)}
          >
            Không
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-400
            cursor-pointer px-3 py-2 text-white rounded-lg"
            disabled={isDeleting} onClick={onDeleteEvent}
          >
            Có
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}