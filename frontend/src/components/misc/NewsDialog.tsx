import dayjs from '@/util/dayjs';
import { ReactNode } from "react";
import { NewsType } from "@/services/schemes/news";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog";
import { NewsCategoryBadge } from '../admin/news-manager/NewsCard';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '../ui/scroll-area';

export const NewsDialog = ({ news, children }: { news: NewsType, children: ReactNode }) => {
  const createdAt = dayjs(news.created_at);
  const formattedDate = createdAt.fromNow();
  const fullDate = createdAt.format('MMMM D, YYYY [at] h:mm A');

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="w-3/5 max-w-none max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle className="inter-semibold text-3xl mb-2">
            {news.title}
          </DialogTitle>
          <DialogDescription className='flex flex-row items-center gap-3 text-sm text-muted-foreground'>
            <span title={fullDate}>{formattedDate}</span>
            <NewsCategoryBadge category={news.category} />
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 mt-4 pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}