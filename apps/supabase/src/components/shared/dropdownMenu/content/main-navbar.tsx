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
        href={`/u/${user?.full_name ?? user?.id}`}
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
          Profile
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
          Settings
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
          Support
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
          Report a bug
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
