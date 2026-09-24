"use client";

import { useEffect, useState } from "react";
import {
  getLinkPreviewAction,
  type LinkPreviewData,
} from "@/lib/actions/linkPreview/actions";

/** Card showing Open Graph metadata (title, description, image) for a URL. */
export function LinkPreview({ url }: { url: string }) {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLinkPreviewAction(url).then((data) => {
      if (!cancelled) setPreview(data);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!preview || !preview.title) return null;

  let host = "";
  try {
    host = new URL(preview.url).hostname;
  } catch {
    host = preview.siteName ?? "";
  }

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex w-full overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50 hover:bg-slate-100"
      data-testid="link-preview"
    >
      {preview.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.image}
          alt=""
          className="h-24 w-24 shrink-0 object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col justify-center gap-1 p-3">
        <span className="truncate text-xs text-slate-500">{host}</span>
        <span className="line-clamp-1 text-sm font-semibold text-slate-900">
          {preview.title}
        </span>
        {preview.description && (
          <span className="line-clamp-2 text-xs text-slate-600">
            {preview.description}
          </span>
        )}
      </div>
    </a>
  );
}
