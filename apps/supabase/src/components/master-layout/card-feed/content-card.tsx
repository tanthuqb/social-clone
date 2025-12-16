"use client";

import { useEffect, useRef, useState } from "react";
import { BaseCommonBTN } from "../button/base-common-btn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@suzu/ui";

interface ContentCardProps {
  feed: Feed_Detail;
  isComment?: boolean;
  inFeed: boolean;
}

const ContentCard = ({ feed, isComment, inFeed }: ContentCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Checou overflow is triggered
  function isOverflow() {
    const element = divRef.current;
    if (!element) return;
    return (
      element.scrollHeight > element.clientHeight || //
      element.scrollWidth > element.clientWidth
    ); //
  }

  useEffect(() => {
    if (divRef.current) {
      const isTruncated = isOverflow();
      if (!isTruncated) {
        setIsExpanded(true);
      }
    }
  }, []);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-start self-stretch overflow-hidden">
      {/* Type 1 */}
      {feed?.content && feed?.content != "<p></p>" && (
        <div className={`${isComment ? "mt-[1.5px]" : "mt-2.5"} px-4`}>
          <div className="relative">
            <div
              ref={divRef}
              id="content-titap"
              className={`${isExpanded || !inFeed ? "line-clamp-none" : "line-clamp-2"} sz-parag-reg whitespace-pre-wrap break-all text-slate-900`}
              dangerouslySetInnerHTML={{ __html: feed?.content! }}
            ></div>
            {/* {inFeed && <Link href={`/p/${feed?.id}`} className="inset-0 absolute"></Link>} */}
          </div>
          {isExpanded === false && inFeed && (
            <BaseCommonBTN
              text="Xem thêm"
              onClick={handleClick}
              className="sz-label-m-semi text-neutral-700"
              isButton={true}
              inFeed={inFeed}
            />
          )}
        </div>
      )}

      {/* Type = 2 */}
      {feed?.type === "feed" &&
        feed?.feed_images &&
        feed?.feed_images.length > 0 && (
          <div
            className={`${isComment ? "mt-[1.5px]" : "mt-2.5"} h-full w-full px-4`}
          >
            {feed!.feed_images.length >= 2 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="flex w-full cursor-pointer items-start justify-between gap-2">
                      {feed?.feed_images.map((item, index) => (
                        <CarouselItem
                          key={index}
                          className={`rounded-[8px] bg-slate-50 ${feed?.feed_images?.length === 1 ? "" : "max-w-[470px]"} `}
                        >
                          <div
                            className={`aspect-square overflow-hidden rounded-[8px] border border-slate-100`}
                          >
                            <img
                              src={item?.image}
                              alt="image"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* {feed?.feed_images?.length > 1 && <CarouselPrevious />}
                    {feed?.feed_images?.length > 1 && <CarouselNext />} */}
                  </Carousel>
                </DialogTrigger>
                <DialogContent className="h-[calc(100dvh_-_190px)] w-[calc(100dvw_-_5px)] bg-black/0 pl-0 pt-6 sm:h-[calc(100dvh_-_0px)] sm:w-[calc(100dvw_-_128px)] sm:p-0">
                  <Carousel className="mx-auto w-[390px] items-center overflow-hidden sm:w-[940px]">
                    <CarouselContent className="flex w-full cursor-pointer items-start justify-between gap-2">
                      {feed?.feed_images.map((item, index) => (
                        <CarouselItem
                          key={index}
                          className="flex h-full items-center justify-center p-0 sm:aspect-square"
                        >
                          <img
                            src={item?.image}
                            alt="image"
                            className="h-full w-full rounded-[8px] object-cover sm:rounded-none"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="hidden sm:flex">
                      <CarouselPrevious />
                    </div>

                    <div className="hidden sm:flex">
                      <CarouselNext />
                    </div>
                  </Carousel>
                </DialogContent>
              </Dialog>
            )}
            {feed!.feed_images.length === 1 && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-8px bg-slate-50">
                    <div
                      className={`aspect-square overflow-hidden rounded-[8px] border border-slate-100`}
                    >
                      <img
                        src={feed!.feed_images[0].image}
                        alt="image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="h-[calc(100dvh_-_190px)] w-[calc(100dvw_-_5px)] bg-black/0 pl-0 pt-6 sm:h-[calc(100dvh_-_0px)] sm:w-[calc(100dvw_-_128px)] sm:p-0">
                  <div
                    className={`mx-auto w-[390px] items-center overflow-hidden rounded-[8px] sm:aspect-square sm:w-[940px] sm:rounded-none`}
                  >
                    <img
                      src={feed!.feed_images[0].image}
                      alt="image"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      {/* Type 3 */}
      {/* Type 4 */}
      {/* Type 5 */}
    </div>
  );
};

export { ContentCard };
