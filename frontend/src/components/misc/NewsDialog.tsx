import dayjs from '@/util/dayjs';
import { ReactNode } from "react";
import { NewsType } from "@/services/schemes/news";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog";
import { NewsCategoryBadge } from '../admin/news-manager/NewsCard';

export const NewsDialog = ({ news, children }: { news: NewsType, children: ReactNode }) => {
  const createdAt = dayjs(news.created_at);
  const formattedDate = createdAt.fromNow();

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="w-2/3 max-w-none">
        <DialogHeader>
          <DialogTitle className="inter-semibold text-3xl">{
            news.title
          }</DialogTitle>
          <div className='h-3' />
          <DialogDescription className='flex flex-row items-center gap-3'>
            {formattedDate}
            <NewsCategoryBadge category={news.category} />
          </DialogDescription>
        </DialogHeader>
        <p className="national-park-medium">{news.content}</p>
      </DialogContent>
    </Dialog>
  )
}