import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import customSlugify from "slugify";
export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789");
const isProduction = process.env.NODE_ENV === 'production';
const url = isProduction ? 'https://dev.suzu.net' : 'http://localhost:3000';


export function constructMetadata({
  title = `${process.env.NEXT_PUBLIC_APP_NAME}`,
  description = `${process.env.NEXT_PUBLIC_APP_NAME} is the modern social network for creators, artists, and their fans.`,
  image = `${url}/thumbnail.png`,
  icons = `${url}/favicon.png`,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    referrer: "no-referrer",
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "dinhkhanh.dk",
    },
    icons,
    metadataBase: new URL(url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

type SlugifyOptions = {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
};

export const slugify = (
  string: string,
  options?: SlugifyOptions,
  args?: customSlugify.ExtendArgs | { [key: string]: any },
): string => {
  const defaultOptions: SlugifyOptions = {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  };

  const defaultExtend = {
    đ: "d",
  };

  customSlugify.extend({ ...defaultExtend, ...args });
  return customSlugify(string, { ...defaultOptions, ...options });
};

export const getURL = (path: string = "") => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3001/";

  url = url.replace(/\/+$/, "");
  url = url.includes("http") ? url : `https://${url}`;
  path = path.replace(/^\/+/, "");
  return path ? `${url}/${path}` : url;
};


export const  stripHtml = (html: string): string =>{
  return html.replace(/<[^>]*>?/gm, '');
}