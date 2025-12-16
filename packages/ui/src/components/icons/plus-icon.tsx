"use client";
import { cn } from "../../lib/utils";

type ButtonState = "default" | "active" | "disabled";

function PlusIcon({
  className,
  state,
}: {
  className?: string;
  state: ButtonState;
}) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-all hover:cursor-pointer hover:text-[#0F172A] group-hover:text-[#0F172A]",
        {
          "text-slate-500": state === "default",
          "text-[#0F172A]": state === "active",
          "text-slate-300": state === "disabled",
        },
        className,
      )}
    >
      <path
        d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5H36C37.933 0.5 39.5 2.067 39.5 4V30C39.5 35.2467 35.2467 39.5 30 39.5H4C2.067 39.5 0.5 37.933 0.5 36V10Z"
        fill="white"
      />
      <path
        d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5H36C37.933 0.5 39.5 2.067 39.5 4V30C39.5 35.2467 35.2467 39.5 30 39.5H4C2.067 39.5 0.5 37.933 0.5 36V10Z"
        stroke="#E7E7E7"
      />
      <g clipPath="url(#clip0_5540_112943)">
        <path
          d="M20 10.6667L20 29.3334M10.6667 20.0001L29.3333 20.0001"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_5540_112943">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="32"
    //   height="32"
    //   viewBox="0 0 32 32"
    //   fill="none"
    //   className={cn(
    //     "transition-all hover:cursor-pointer hover:text-[#0F172A] group-hover:text-[#0F172A]",
    //     {
    //       "text-slate-500": state === "default",
    //       "text-[#0F172A]": state === "active",
    //       "text-slate-300": state === "disabled",
    //     },
    //     className,
    //   )}
    // >
    //   <path
    //     d="M16.0001 6.66675L16.0001 25.3334M6.66675 16.0001L25.3334 16.0001"
    //     stroke="#0F172A"
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>
  );
}

export { PlusIcon };
