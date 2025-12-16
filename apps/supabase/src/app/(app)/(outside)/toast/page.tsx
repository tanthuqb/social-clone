"use client";
import { Button, toast } from "@suzu/ui";
import { Camera } from "lucide-react";
import Link from "next/link";
import { 
  toastFeed
} from "./toast";

const Page = () => {
  const handleClick = () => {
    toast(
      'Chup nè trt hjfgse shjfb bhc',
      {
        icon: <Camera size={20} />,
        duration: 5000000,
        action: (
          <Link href={""} className="flex items-end">
            Xem
          </Link>
        ),
      },
    )
  }
  return (
    <div>
      <h1>Welcome to My Page</h1>
      <p>This is a Next.js page that uses the Sonner toast component.</p>

      <button
        type="button"
        onClick={handleClick}
        className="bg-orange-400"
      >
        click
      </button>

      <div className="mb-5 text-2xl font-semibold uppercase">
        Test basic text
      </div>

      <button
        type="button"
        // Đang tải lên...
        onClick={() => toastFeed("Đang tải lên...", "loadingIcon")}
        className="bg-orange-400 m-4"
      >
        toastLoadingFeed
      </button>

      <button
        type="button"
        onClick={() => toastFeed("Đăng bài thành công", "checkIcon")}
        className="bg-orange-400 m-4"
      >
        toastPostingSuccessFeed
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Đã xóa")}
        className="bg-orange-400 m-4"
      >
        toastDeletedFeed
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Đã lưu bài viết", "checkIcon", "Xem tất cả")}
        className="bg-orange-400 m-4"
      >
        toastSavedFeed
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Xóa khỏi danh sách lưu", "checkIcon", "Hoàn tác")}
        className="bg-orange-400 m-4"
      >
        toastUnSaveFeed
      </button>

      <button
        type="button"
        onClick={() => toastFeed("Đang chỉnh sửa...", "loadingIcon")}
        className="bg-orange-400 m-4"
      >
        toastEditFeedLoading
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Chỉnh sửa thành công", "checkIcon", "Xem")}
        className="bg-orange-400 m-4"
      >
        toastEditFeedSuccess
      </button>
     
      <button
        type="button"
        onClick={() => toastFeed("Đã ghim bài viết")}
        className="bg-orange-400 m-4"
      >
        toastPinFeed
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Hủy ghim bài viết")}
        className="bg-orange-400 m-4"
      >
        toastUnpinFeed
      </button>
      
      <button
        type="button"
        onClick={() => toastFeed("Đã ẩn bài viết", "Hoàn tác")}
        className="bg-orange-400 m-4"
      >
        toastHideFeed
      </button>
     
      <button
        type="button"
        onClick={() => toastFeed("Đã sao chép")}
        className="bg-orange-400 m-4"
      >
        toastCopyFeed
      </button>
    </div>
  );
};

export default Page;
