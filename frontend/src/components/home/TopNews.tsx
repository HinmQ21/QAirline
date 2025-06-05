import dayjs from "dayjs";
import { css } from "@/css/styles";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FaArrowRight } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { clientApi } from "@/services/client/main";
import { NewsType } from "@/services/schemes/news";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


const SimpleNewsCard = ({ news, offstage = false }: { news: NewsType, offstage?: boolean }) => {
  const created_date = dayjs(news.created_at);

  return (
    <div className={`
      flex flex-col w-max absolute justify-center h-full
      ${offstage ? css.offstage.on : css.offstage.off}
    `}>
      <p className="text-sm text-gray-700">{created_date.format("DD - MM - YYYY")}</p>
      <p className="reddit-medium underline text-blue-800 cursor-pointer" onClick={
        () => console.log("News clicked:", news.news_id)
      }>{news.title}</p>
    </div>
  );
}

export const TopNews = () => {
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [newsList, setNewsList] = useState<NewsType[] | null>(null);

  useEffect(() => {
    clientApi.getNewsList({ page: 1, limit: 5 }).then((response) => {
      setNewsList(response.news);
    }).catch((error) => {
      console.error("Failed to fetch news:", error);
      setErrMsg("Failed to fetch news");
    });
  }, []);

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSwifting = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (newsList && newsList.length > 1) {
        setIndex(prev => (prev + 1) % newsList.length);
      }
    }, 3000);
  }

  const stopSwitfing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    startSwifting();
    return () => stopSwitfing();
  }, [newsList]);


  return (
    <div className="
      my-3 h-12
      flex flex-row flex-wrap
      items-center justify-between
    ">
      <div className="flex flex-row items-center h-full">
        <div className="flex flex-row items-center px-7 text-blue-900 text-xl gap-x-2">
          <FaRegNewspaper />
          <p className="montserrat-medium">Tin tức</p>
        </div>
        <Separator orientation="vertical" className="w-px bg-gray-500 mr-7" />
        {
          errMsg ? (
            <p className="text-red-500">{errMsg}</p>
          ) : newsList === null ? (
            <p className="text-gray-800">Loading...</p>
          ) : newsList.length > 0 ? (
            <div
              className="relative h-full"
              onMouseEnter={stopSwitfing}
              onMouseLeave={startSwifting}
            >{
                newsList.map((news, i) => (
                  <SimpleNewsCard
                    key={news.news_id}
                    news={news}
                    offstage={i !== index}
                  />
                ))
              }</div>
          ) : (
            <p className="text-gray-800">No news available</p>
          )
        }
      </div>
      <div className="mr-7 flex flex-row items-center h-full gap-x-5">
        <div className="flex flex-col items-center">
          <IoIosArrowUp className="cursor-pointer"
            onClick={() => {
              stopSwitfing();
              setIndex(prev => (prev - 1 + newsList!.length) % newsList!.length);
              startSwifting();
            }}
          />
          <p className="text-sm">{`${index + 1}/${newsList?.length}`}</p>
          <IoIosArrowDown className="cursor-pointer"
            onClick={() => {
              stopSwitfing();
              setIndex(prev => (prev + 1) % newsList!.length);
              startSwifting();
            }}
          />
        </div>
        <Button className="bg-slate-300 hover:bg-slate-200 text-sky-900 py-6 px-7 cursor-pointer">
          Xem Thêm
          <FaArrowRight />
        </Button>
      </div>
    </div>
  )
}