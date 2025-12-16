"use client";

import { UserACtion } from "@/modules/user/user.action";

export default function SignOutBtn() {
  const { SignOut } = UserACtion();
  return (
    <button
      type="button"
      className="flex w-full items-center space-x-3 text-left"
      onClick={SignOut}
    >
      {/* <LogoutIcon className="w-4 h-4 mr-2" /> */}
      Đăng xuất
    </button>
  );
}
