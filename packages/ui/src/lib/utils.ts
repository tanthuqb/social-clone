import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("vi", {
  relativeTime: {
    future: "%s tới",
    past: "%s trước",
    s: "1 giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import ms from "ms";
import { customAlphabet } from "nanoid";

export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

export function nFormatter(
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  },
) {
  if (!num) return "0";
  if (opts.full) {
    return Intl.NumberFormat("en-US").format(num);
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (_item: any) {
      return num >= _item.value;
    });

  return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, "$1") + item.symbol
    : "0";
}

export const timeAgo = (
  timestamp: Date | null | undefined,
  {
    withAgo,
  }: {
    withAgo?: boolean;
  } = {},
): string => {
  if (!timestamp) return "Never";

  return dayjs(timestamp).locale("vi").tz("Asia/Ho_Chi_Minh").fromNow();
  // const diff = Date.now() - new Date(timestamp).getTime();
  // if (diff < 1000) {
  //   // less than 1 second
  //   return "Just now";
  // } else if (diff > 82800000) {
  //   // more than 23 hours – similar to how Twitter displays timestamps
  //   return new Date(timestamp).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year:
  //       new Date(timestamp).getFullYear() !== new Date().getFullYear()
  //         ? "numeric"
  //         : undefined,
  //   });
  // }
  // return `${ms(diff)}${withAgo ? " ago" : ""}`;
};

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length)
    return { truncatedText: str, wasTruncated: false };
  return { truncatedText: str.slice(0, length) + "...", wasTruncated: true };
};

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const DUB_LOGO =
  "https://res.cloudinary.com/dinhkhanh/image/upload/v1704657516/Logo_lqnye9.png";
export const DUB_THUMBNAIL =
  "https://d2vwwcvoksz7ty.cloudfront.net/thumbnail.png";
