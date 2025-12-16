"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ButtonState = "default" | "active" | "disabled";
interface ButtonProps {
  text: string;
  loadingicon?: boolean | ReactNode;
  activeButton?: boolean;
  type?: "Fill" | "Outline" | "Ghost" | "Reversed";
  states?: ButtonState;
  className?: string;
  IconLeft?: React.ElementType<{
    className?: string;
    state: ButtonState;
  }>;
  href?: string;
  IconRight?: React.ElementType<{
    className?: string;
    state: ButtonState;
  }>;
}

function CommonButton({
  text,
  IconLeft,
  IconRight,
  href,
  states,
  className,
  activeButton,
  ...props
}: ButtonProps) {
  const pathname = usePathname();
  const isActiveButton = pathname === href;

  return states === "default" ? (
    <>
      {/* @ts-ignore */}
      <div
        className={`flex flex-col items-center gap-1 rounded-full ${isActiveButton ? "bg-slate-50" : ""} px-4 py-2`}
      >
        <button
          className="flex items-center gap-2 border-none"
          disabled={activeButton}
        >
          {IconLeft && (
            <IconLeft
              state={isActiveButton ? "active" : "default"}
              className=""
            />
          )}
          {text && (
            <div
              className={`text-[15px] font-semibold ${text === "Hủy bỏ" || text === "Đăng xuất" ? "text-slate-900" : activeButton ? "text-slate-500" : "text-white"} `}
            >
              {text}
            </div>
          )}
          {IconRight && (
            <IconRight
              state={isActiveButton ? "active" : "default"}
              className=""
            />
          )}
        </button>
      </div>
    </>
  ) : (
    <>
      <button className="flex items-center gap-2 border-none">
        <Link
          href={`${href}`}
          className={`flex items-center gap-1 rounded-full px-4 py-2 ${isActiveButton ? "bg-slate-50" : ""}`}
        >
          {IconLeft && (
            <IconLeft
              state={isActiveButton ? "active" : "default"}
              className=""
            />
          )}
          {text && (
            <div className="text-[15px] font-semibold  text-slate-900">
              {text}
            </div>
          )}
          {IconRight && (
            <IconRight
              state={isActiveButton ? "active" : "default"}
              className=""
            />
          )}
        </Link>
      </button>
    </>
  );
}
export { CommonButton };
