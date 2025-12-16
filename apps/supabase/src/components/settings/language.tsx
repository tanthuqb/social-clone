"use client";

import {
  CommonButton,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@suzu/ui";
import { useState } from "react";

function Language() {
  const [activeButton, setActiveButton] = useState(false);
  return (
    <div className="h-full max-h-full overflow-y-auto">
      <div className="flex h-full max-w-xl flex-col gap-4">
        <div className="flex w-full flex-col items-start gap-5 rounded-[20px] px-4">
          <div className="flex flex-col items-start gap-1 self-stretch">
            <div className="flex items-start justify-between text-[15px] font-semibold text-slate-700">
              Bạn dùng ngôn ngữ nào
            </div>
            <Select
              defaultValue="vn"
              onValueChange={() => setActiveButton(true)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language please!" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="vn">Tiếng Việt</SelectItem>
                  <SelectItem value="en">Tiếng Anh</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-grow border-b border-b-[#1f1f1f/1]"></div>
        <div
          className={`w-full items-center gap-1 self-stretch px-4 text-center md:text-right ${activeButton ? "cursor-pointer" : ""}`}
        >
          <button
            type="submit"
            className="btn btn-default block w-full md:inline-block md:w-auto"
            disabled={!activeButton}
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Language;
