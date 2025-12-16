"use client";

import { BaseText } from "@/components/master-layout/base-text";
import { TabsList, TabsTrigger, cn } from "@suzu/ui";
import { useState } from "react";

const TabListCustom = () => {
  const [activeFeedTab, setActiveFeedTab] = useState(true);
  const [activeBookmarksTab, setActiveBookmarksTab] = useState(false);
  const handleClickFeedTabs = (e: any) => {
    const isFeed = e.target.innerText === "Bài đăng";
    const isBookmarks = e.target.innerText === "Đã lưu";
    if (isFeed) {
      setActiveFeedTab(!activeFeedTab);
      setActiveBookmarksTab(!activeBookmarksTab);
    } else if (isBookmarks) {
      setActiveFeedTab(!activeFeedTab);
      setActiveBookmarksTab(!activeBookmarksTab);
    }
  };
  const handleClickBookmarksTabs = (e: any) => {
    const isFeed = e.target.innerText === "Bài đăng";
    const isBookmarks = e.target.innerText === "Đã lưu";
    if (isFeed) {
      setActiveFeedTab(!activeFeedTab);
      setActiveBookmarksTab(!activeBookmarksTab);
    } else if (isBookmarks) {
      setActiveFeedTab(!activeFeedTab);
      setActiveBookmarksTab(!activeBookmarksTab);
    }
  };
  return (
    <TabsList className="grid w-full grid-cols-2 rounded-none bg-white px-4 shadow-none">
      <TabsTrigger
        onClick={(e) => handleClickFeedTabs(e)}
        value="feeds"
        className={cn("rounded-none border-b border-white shadow-none", {
          "border-neutral-700": activeFeedTab,
        })}
      >
        <BaseText
          text={"Bài đăng"}
          className="sz-label-m-semi"
          textColor="neutral-700"
        />
      </TabsTrigger>
      <TabsTrigger
        onClick={(e) => handleClickBookmarksTabs(e)}
        value="bookmarks"
        className={cn("rounded-none border-b border-white shadow-none", {
          "border-neutral-700": activeBookmarksTab,
        })}
      >
        <BaseText
          text={"Đã lưu"}
          className="sz-label-m-semi"
          textColor="neutral-700"
        />
      </TabsTrigger>
    </TabsList>
  );
};

export { TabListCustom };
