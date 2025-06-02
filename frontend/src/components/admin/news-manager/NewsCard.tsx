import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import { NewsCategoryBadge } from "./NewsList";
import { NewsType } from "@/services/admin/news";
import { DeleteNewsButton } from "./DeleteNewsButton";
import { NewsWritingDialog } from "./NewsWritingDialog";

type NewsCardProps = {
  news: NewsType;
  deleteNewsStateAction: (news_id: number) => void;
}

export const NewsCard = ({ news, deleteNewsStateAction }: NewsCardProps) => {
  const created_date = dayjs(news.created_at);

  // return (
  //   <NewsWritingDialog

  //   ></NewsWritingDialog>
  // );

  return (
    <div className="
      flex flex-row items-center justify-between
      h-18 w-120 bg-white rounded-xl
      hover:shadow-2xl transition-all duration-300
      cursor-pointer
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
    </div>
  );
};

export const NewsCardSkeleton = () => {
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

