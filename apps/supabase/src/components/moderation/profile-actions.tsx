"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@suzu/ui";
import { Ellipsis } from "lucide-react";
import { useModeration } from "./moderation-provider";

/** "More" menu on another user's profile: block or report the user. */
export function ProfileActions({ userId, name }: { userId: string; name: string }) {
  const { openBlock, openReport } = useModeration();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Profile options"
        data-testid="profile-actions"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white hover:bg-slate-50"
      >
        <Ellipsis className="h-5 w-5 text-slate-700" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 shadow-xl">
        <DropdownMenuItem
          className="cursor-pointer text-[15px] text-red-500"
          onSelect={() => openBlock({ userId, name })}
        >
          Block
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-[15px] text-red-500"
          onSelect={() => openReport({ target: "user", targetId: userId })}
        >
          Report user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
