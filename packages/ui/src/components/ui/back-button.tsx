"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";

export function useBackPath(currentResource: string) {
  const pathname = usePathname();
  const segmentCount = pathname.slice(1).split("/");
  const backPath =
    segmentCount.length > 2
      ? pathname.slice(0, pathname.indexOf(currentResource) - 1)
      : pathname.slice(0, pathname.indexOf(segmentCount[1]));
  return backPath;
}

export function BackButton({
  currentResource,
  stroke,
  states,
}: {
  /* must be in kebab-case */
  currentResource: string;
  stroke?: string;
  states?: string;
}) {
  const backPath = useBackPath(currentResource);
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };
  return (
    <>
      {/* asChild */}
      {states !== "disable" ? (
        <Button variant={"ghost"} onClick={handleClickBack} size={"icon"} className="rounded-full">
          {/* <Link href={backPath}> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
          >
            <path
              d="M15.1133 8.89453L1.11328 8.89453M1.11328 8.89453L8.11328 1.89453M1.11328 8.89453L8.11328 15.8945"
              stroke={`${stroke ? stroke : "#0F172A"}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* </Link> */}
        </Button>
      ) : (
        <Button variant={"ghost"} size={"icon"}>
          {/* <Link href={backPath}> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
          >
            <path
              d="M15.1133 8.89453L1.11328 8.89453M1.11328 8.89453L8.11328 1.89453M1.11328 8.89453L8.11328 15.8945"
              stroke={`${stroke ? stroke : "#0F172A"}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* </Link> */}
        </Button>
      )}
    </>
  );
}
