"use client";

import { BaseText } from "../base-text";
import { BaseIconBTN } from "./base-icon-btn";
interface PropsBTN {
  className?: string;
  onClick?: () => void;
  srcImgLeft?: string;
  srcImgRight?: string;
  text?: string;
  typeText?: string;
  type?: string;
  isButton: boolean;
  inFeed?: boolean;
}

export function BaseCommonBTN({
  className,
  srcImgLeft,
  srcImgRight,
  text,
  onClick,
  isButton,
  inFeed,
}: PropsBTN) {
  return (
    <div className="cursor-pointer">
      {isButton ? (
        <button className={className} onClick={onClick || (() => {})}>
          {srcImgLeft && (
            <BaseIconBTN
              width={24}
              height={24}
              src={srcImgLeft}
              className={`${!inFeed ? "hover:bg-trans-black-10 rounded-full p-2" : ""}`}
            />
          )}
          {text && (
            <BaseText
              className="sz-label-m-semi"
              text={text}
              textColor="neutral-700"
            />
          )}
          {srcImgRight && (
            <BaseIconBTN
              width={24}
              height={24}
              src={srcImgRight}
              className=""
            />
          )}
        </button>
      ) : (
        <div className={className} onClick={onClick || (() => {})}>
          {srcImgLeft && (
            <BaseIconBTN width={24} height={24} src={srcImgLeft} className="" />
          )}
          {text && (
            <BaseText
              className="sz-label-m-semi"
              text={text}
              textColor="slate-700"
            />
          )}
          {srcImgRight && (
            <BaseIconBTN
              width={24}
              height={24}
              src={srcImgRight}
              className=""
            />
          )}
        </div>
      )}
    </div>
  );
}
