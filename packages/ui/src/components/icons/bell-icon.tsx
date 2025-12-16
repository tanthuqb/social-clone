"use client";
import { cn } from "../../lib/utils";
// import { BgdCommonBadges } from "../ui/bgd_commonBadges";

type ButtonState = "default" | "active" | "disabled";

function BellIcon({
  className,
  state,
  notifications,
}: {
  className?: string;
  state: ButtonState;
  notifications?: number;
}) {
  return (
    <div className="relative">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          " transition-all hover:cursor-pointer hover:text-[#0F172A] group-hover:text-[#0F172A]",
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
            <g clipPath="url(#clip0_5568_89088)">
              <path
                d="M9.35395 21C10.0591 21.6224 10.9853 22 11.9998 22C13.0142 22 13.9405 21.6224 14.6456 21M17.9998 8C17.9998 6.4087 17.3676 4.88258 16.2424 3.75736C15.1172 2.63214 13.5911 2 11.9998 2C10.4085 2 8.88235 2.63214 7.75713 3.75736C6.63192 4.88258 5.99977 6.4087 5.99977 8C5.99977 11.0902 5.22024 13.206 4.34944 14.6054C3.6149 15.7859 3.24763 16.3761 3.2611 16.5408C3.27601 16.7231 3.31463 16.7926 3.46155 16.9016C3.59423 17 4.19237 17 5.38863 17L18.6109 17C19.8072 17 20.4053 17 20.538 16.9016C20.6849 16.7926 20.7235 16.7231 20.7384 16.5408C20.7519 16.3761 20.3846 15.7859 19.6501 14.6054C18.7793 13.206 17.9998 11.0902 17.9998 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_5568_89088">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </>
        )}
        {state === "active" && (
          <>
            <g clipPath="url(#clip0_6985_7402)">
              <path
                d="M17.7013 8.2C17.7013 6.68827 17.1008 5.23845 16.0318 4.16949C14.9629 3.10053 13.513 2.5 12.0013 2.5C10.4896 2.5 9.03975 3.10053 7.97079 4.16949C6.90183 5.23845 6.3013 6.68827 6.3013 8.2C6.3013 11.1357 5.56075 13.1457 4.73348 14.4751C4.03567 15.5966 3.68676 16.1573 3.69956 16.3137C3.71372 16.4869 3.75042 16.553 3.88999 16.6565C4.01604 16.75 4.58426 16.75 5.72071 16.75L18.2819 16.75C19.4183 16.75 19.9866 16.75 20.1126 16.6565C20.2522 16.553 20.2889 16.4869 20.303 16.3137C20.3158 16.1573 19.9669 15.5966 19.2691 14.4751C18.4419 13.1457 17.7013 11.1357 17.7013 8.2Z"
                fill="currentColor"
              />
              <path
                d="M9.48777 20.55C10.1576 21.1412 11.0376 21.5 12.0013 21.5C12.965 21.5 13.845 21.1412 14.5148 20.55M17.7013 8.2C17.7013 6.68827 17.1008 5.23845 16.0318 4.16949C14.9629 3.10053 13.513 2.5 12.0013 2.5C10.4896 2.5 9.03975 3.10053 7.97079 4.16949C6.90183 5.23845 6.3013 6.68827 6.3013 8.2C6.3013 11.1357 5.56075 13.1457 4.73348 14.4751C4.03567 15.5966 3.68676 16.1573 3.69956 16.3137C3.71372 16.4869 3.75042 16.553 3.88999 16.6565C4.01604 16.75 4.58426 16.75 5.72071 16.75L18.2819 16.75C19.4183 16.75 19.9866 16.75 20.1126 16.6565C20.2522 16.553 20.2889 16.4869 20.303 16.3137C20.3158 16.1573 19.9669 15.5966 19.2691 14.4751C18.4419 13.1457 17.7013 11.1357 17.7013 8.2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_6985_7402">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </>
        )}
      </svg>
      <div className="absolute -top-[6px] left-2.5 z-10">
        {/* {notifications ? (
          <BgdCommonBadges
            text={notifications >= 100 ? 99 : notifications}
            size="md"
            className=""
            plus={notifications >= 100 ? true : false}
          />
        ) : (
          <></>
        )} */}
      </div>
    </div>
  );
}

export { BellIcon };
