/* eslint-disable no-redeclare */
import React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = event.currentTarget;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    return (
      <textarea
        className={cn(
          "flex w-full overflow-y-auto rounded-md bg-background py-2 pl-2 pr-0 text-sm placeholder:text-neutral-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
        onInput={handleInput}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
