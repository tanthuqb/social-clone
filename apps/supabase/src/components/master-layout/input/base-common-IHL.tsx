"use client";

import { SetStateAction } from "react";
import { InputHiddenLabel } from "./input-hidden-label";
import { cn } from "@suzu/ui";

interface PropsBTN {
  className?: string;
  onClick: () => void;
  srcLeft?: string;
  srcRight?: string;
  valueInput: string;
  type?: string;
  placeholder: string;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange: (e: { target: { value: SetStateAction<string> } }) => void;
}

export function BaseCommonIHL({
  className,
  srcLeft,
  srcRight,
  placeholder,
  onChange,
  onClick,
  valueInput,
  handleKeyDown,
  inputRef,
}: PropsBTN) {
  return (
    <InputHiddenLabel
      srcLeft={srcLeft}
      srcRight={srcRight}
      placeholder={placeholder}
      onChange={onChange}
      onClick={onClick}
      valueInput={valueInput}
      handleKeyDown={handleKeyDown}
      inputRef={inputRef}
    />
  );
}
