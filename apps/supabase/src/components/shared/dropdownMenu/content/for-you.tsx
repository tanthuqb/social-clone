"use client";

import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";

export const ForYou = ({ className }: { className?: string }) => {
  return (
    <>
      <DropdownMenuItem
        className={cn("cursor-pointer text-[15px] text-slate-900", className)}
      >
        For you
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className={cn("cursor-pointer text-[15px] text-slate-900", className)}
      >
        Following
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className={cn("cursor-pointer text-[15px] text-slate-900", className)}
      >
        Save
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className={cn("cursor-pointer text-[15px] text-slate-900", className)}
      >
        Like
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  );
};
