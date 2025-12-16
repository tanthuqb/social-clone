"use client";
import { cn } from "../../lib/utils";

type ButtonState = "default" | "active" | "disabled";
type IconProps = {
  className?: string;
  state: ButtonState;
};

function SearchIcon({ className, state }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
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
      {state === "default" && (
        <>
          <g clipPath="url(#clip0_5568_89020)">
            <path
              d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_5568_89020">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </>
      )}
      {state === "active" && (
        <>
          <g clipPath="url(#clip0_6985_9258)">
            <path
              d="M11.5 20C16.1944 20 20 16.1944 20 11.5C20 6.80558 16.1944 3 11.5 3C6.80558 3 3 6.80558 3 11.5C3 16.1944 6.80558 20 11.5 20Z"
              fill="currentColor"
            />
            <path
              d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_6985_9258">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </>
      )}
    </svg>
  );
}

export { SearchIcon };
