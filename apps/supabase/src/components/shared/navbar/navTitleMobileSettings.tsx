"use client";

import { usePathname } from "next/navigation";

function NavTitleMbSettings() {
  const arrayPathname = [
    {
      pathname: "/settings/edit-profile",
      title: "Chỉnh sủa hồ sơ",
    },
    {
      pathname: "/settings/account-management",
      title: "Quản lý tài khoản",
    },
    {
      pathname: "/settings/account-management/change-password",
      title: "Quản lý tài khoản",
    },
    {
      pathname: "/settings/term-service",
      title: "Điều khoản & dịch vụ",
    },
  ];
  const pathname = usePathname();
  const isCurrentPage = arrayPathname.some(
    (item) => item.pathname === pathname,
  );

  const findTitle = arrayPathname.find(
    (title) => title.pathname === pathname,
  )?.title;

  return (
    <div
      className={`flex items-center justify-center text-center text-[18px] font-semibold text-slate-900 md:hidden ${
        isCurrentPage ? "block" : "hidden"
      }`}
    >
      {findTitle}
    </div>
  );
}

export default NavTitleMbSettings;
