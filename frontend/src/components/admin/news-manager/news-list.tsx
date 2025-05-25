import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useEffect, useState } from "react"
import { getNewsList, newsCategoryLabels, NewsCategoryType, NewsType } from "@/services/admin/news";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";

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

export const NewsList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getNewsList({ page: 1, limit: 10 }).then(
      (response) => {
        console.log(response);
        setData(response.data.data.news);
      }
    ).catch(
      (err) => {
        let errMsg;
        try {
          errMsg = err.response.data.message;
        }
        catch {
          errMsg = err.toString();
        }
        toast.error(errMsg);
      }
    );
  }, []);

  if (data.length == 0) {
    return <div></div>;
  }

  return (
    <>
      <p>{data.length}</p>
      <div className="flex flex-row flex-wrap justify-center w-full gap-4">
        {data.map((e) => <NewsCard news={e} />)}
      </div>
    </>
  );
}

const NewsCard = ({ news }: { news: NewsType }) => {
  const created_date = dayjs(news.created_at);

  return (
    <div className="flex flex-row h-25 w-128 bg-white rounded-xl items-center justify-between">
      <div className="flex flex-row h-full items-center">
        <div className="
                flex flex-col ml-4.5 items-center justify-center
                text-gray-900 montserrat-medium
              ">
          <p className="text-md">
            {created_date.format("MMM D")}
          </p>
          <p className="text-lg">
            {created_date.format("YYYY")}
          </p>
        </div>
        <div className="w-0.5 h-[60%] bg-gray-600 mx-4.5" />
        <div className="
                flex flex-col justify-center
                text-gray-900 w-55
              ">
          <p className="text-[26px] montserrat-semibold truncate">
            {news.title}
          </p>
          <p className="text-sm montserrat-medium truncate">
            {news.content}
          </p>
        </div>
      </div>
      <div className="flex flex-row h-full items-center">
        <NewsCategoryBadge category={news.category} />
        <div className="ml-4.5 w-0.5 h-[60%] bg-gray-600" />
        <div className="
                w-12 relative h-full text-red-600
                flex flex-row items-center justify-center
              ">
          <AiOutlineDelete size={20} className="absolute cursor-pointer
                  opacity-100 hover:opacity-0 transition-all duration-200" />
          <AiFillDelete size={20} className="absolute cursor-pointer
                  opacity-0 hover:opacity-100 transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};