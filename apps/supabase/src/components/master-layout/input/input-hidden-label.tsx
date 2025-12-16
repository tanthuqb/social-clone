import { cn } from "@suzu/ui";
import React, { SetStateAction, useRef } from "react";
import { BaseIconBTN } from "../button/base-icon-btn";

interface PropsIcon {
  className?: string;
  srcLeft?: string;
  srcRight?: string;
  valueInput: string;
  placeholder: string;
  onChange: (e: { target: { value: SetStateAction<string> } }) => void;
  onClick: (e: any) => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const InputHiddenLabel = ({
  className,
  srcLeft,
  srcRight,
  placeholder,
  onChange,
  onClick,
  valueInput,
  handleKeyDown,
  inputRef,
}: PropsIcon) => {


  return (
    <div className={cn("flex w-full items-center h-12", className)}>
      {srcLeft && <BaseIconBTN src={srcLeft} width={24} height={24} className="p-2" />}
      <input
        className="w-full border-none p-0 ml-2 sz-parag-reg text-neutral-500 focus:ring-0"
        placeholder={placeholder}
        value={valueInput}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {srcRight && (
        <div onClick={onClick} className="cursor-pointer mr-2">
          <BaseIconBTN src={srcRight} width={24} height={24} />
        </div>
      )}
    </div>
  );
};
