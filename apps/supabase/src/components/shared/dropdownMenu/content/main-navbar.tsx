"use client";
import SignOutBtn from "@/components/auth/SignOutBtn";
import { DropdownMenuItem, DropdownMenuSeparator, cn } from "@suzu/ui";
import Link from "next/link";
import { AuthenticationButton } from "./authentication-button";

function MainNavbar({
  className,
  user,
}: {
  className?: string;
  user?: Profile;
}) {
  return user ? (
    <>
      <Link
        // @ts-ignore
        href={`/u/${user?.full_name}`}
      >
        <DropdownMenuItem
          className={cn(
            "cursor-pointer text-[15px] text-slate-900",
            {
              //   "text-slate-500": state === "default",
            },
            className,
          )}
        >
          Trang cá nhân
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
      <Link href="/settings">
        <DropdownMenuItem
          className={cn(
            "cursor-pointer text-[15px] text-slate-900",
            {
              //   "text-slate-500": state === "default",
            },
            className,
          )}
        >
          Cài đặt thông tin
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
      <Link href="/settings/support">
        <DropdownMenuItem
          className={cn(
            "cursor-pointer text-[15px] text-slate-900",
            {
              //   "text-slate-500": state === "default",
            },
            className,
          )}
        >
          Hỗ trợ
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
      <Link href="/settings/support">
        <DropdownMenuItem
          className={cn(
            "cursor-pointer text-[15px] text-slate-900",
            {
              //   "text-slate-500": state === "default",
            },
            className,
          )}
        >
          Báo lỗi
        </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex cursor-pointer items-stretch">
        <SignOutBtn />
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <AuthenticationButton props="Login" />
      <DropdownMenuSeparator color="#E7E7E7" />
      <AuthenticationButton props="Register" />
      <DropdownMenuSeparator color="#E7E7E7" />
      <AuthenticationButton props="Support" />
      <DropdownMenuSeparator color="#E7E7E7" />
      <AuthenticationButton props="Error" />
    </>
  );
}
export { MainNavbar };
