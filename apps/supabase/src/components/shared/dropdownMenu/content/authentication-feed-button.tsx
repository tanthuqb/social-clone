"use client";


import { useContext } from "react";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";


const AuthenticationFeedButton = ({ className }: { className?: string }) => {
    const { setShowLoginModal } =
        useContext(ModalContext);

    const handlelogin = () => {
        setShowLoginModal(true);
    }

    return (
        <>
            <DropdownMenuItem
                onClick={handlelogin}
                className={cn(
                    "cursor-pointer text-[15px] text-slate-900",
                    {
                        //   "text-slate-500": state === "default",
                    },
                    className,
                )}
            >
                Lưu bài viết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={handlelogin}
                className={cn(
                    "cursor-pointer text-[15px] text-slate-900",
                    {
                        //   "text-slate-500": state === "default",
                    },
                    className,
                )}
            >
                Ẩn bài viết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={handlelogin}
                className={cn(
                    "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
                    {
                        //   "text-slate-500": state === "default",
                    },
                    className,
                )}
            >
                <span className="text-red-500 hover:text-red-500">Chặn</span>

            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={handlelogin}
                className={cn(
                    "cursor-pointer text-[15px] text-red-500 hover:text-red-500",
                    {
                        //   "text-slate-500": state === "default",
                    },
                    className,
                )}
            >
                <span className="text-red-500 hover:text-red-500">Báo cáo</span>
            </DropdownMenuItem>
        </>
    );
};

export { AuthenticationFeedButton };
