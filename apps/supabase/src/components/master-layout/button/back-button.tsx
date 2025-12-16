"use client";

import { Button } from "@suzu/ui";
import { usePathname, useRouter } from "next/navigation";
import { BaseIconBTN } from "./base-icon-btn";

export function useBackPath(currentResource: string) {
  const pathname = usePathname();
  const segmentCount = pathname.slice(1).split("/");
  const backPath =
    segmentCount.length > 2
      ? pathname.slice(0, pathname.indexOf(currentResource) - 1)
      : pathname.slice(0, pathname.indexOf(segmentCount[1]));
  return backPath;
}

export function BackButton({ currentResource }: { currentResource: string }) {
  const backPath = useBackPath(currentResource);
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };
  return (
    <Button
      variant={"ghost"}
      onClick={handleClickBack}
      size={"icon"}
      className="rounded-full"
    >
      <BaseIconBTN
        src="/assets/icons-24/arrow-back.png"
        className="hover:bg-trans-black-5 rounded-full p-2"
        width={24}
        height={24}
      />
    </Button>
  );
}
