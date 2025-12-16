"use client";
import { z } from "zod";

import { useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Photo, Textarea, toast } from "@suzu/ui";
import { useValidatedForm } from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";

import { type Action, cn } from "@suzu/ui";
import { Button, useBackPath } from "@suzu/ui";

import { Avatar } from "@/components/shared/avatar";

import { type Feed, insertFeedParams } from "@/lib/db/schema/feeds";
import { useParams } from "next/navigation";
import {
  createFeedAction,
  deleteFeedAction,
  updateFeedAction,
} from "@/lib/actions/feed/actions";

import { createFeedImageAction } from "@/lib/actions/feedImages/actions";
import { createClient } from "@/lib/supabase/client";
import { insertCommentAction } from "@/lib/actions/comments/actions";

export const CommentCreateForm = ({
  commentId,
  user,
  comment,
}: {
  commentId?: string | null;
  user: any;
  comment: any;
}) => {
  const { setShowCommentCreateModal } = useContext(ModalContext);
  const [countContent, setCountContent] = useState(0);

  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Feed>(insertFeedParams);
  const editing = !!commentId;

  const params = useParams();
  const maxCountContent = 300;

  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const { feedId } = params;

  const handleChangeContent = (val: string) => {
    setCountContent(val.length);
  };

  const handleSubmit = async (FormData: FormData) => {
    const supabase = createClient();
    const { data: session, error } = await supabase.auth.getUser();
    if (error || !session || !session.user || !session.user.id) {
      toast.error("chưa đăng nhập");
      return;
    }
    setErrors(null);
    if (editing && !comment) {
      const updateComment = {
        feed_id: feedId as string,
        content: FormData.get("content") as string,
        user_id: user?.id,
      };
      const { data, error } = await supabase
        .from("comments")
        .update(updateComment)
        .eq("id", editing);
      if (error) {
        toast.error("Đăng bình luận thất bại");
        return;
      }
      setShowCommentCreateModal(false);
      toast.success(`Chỉnh sửa thành công!`);
      router.refresh();
    } else {
      if (!comment) {
        const newComment = {
          feed_id: feedId as string,
          content: FormData.get("content") as string,
          user_id: user?.id,
        };
        const { data, error } = await supabase
          .from("comments")
          .insert(newComment);
        if (error) {
          toast.error("Đăng bình luận thất bại");
          return;
        }
        setShowCommentCreateModal(false);
        toast.success(`Đăng bình luận thành công!`);
        router.refresh();
      }
    }

    if (comment) {
      const CommentReply = {
        feed_id: feedId as string,
        content: FormData.get("content") as string,
        user_id: comment.user_id.id,
        parent_id: comment.id,
      };

      const { data, error } = await supabase
        .from("comments")
        .insert(CommentReply)
        .select("*");
      if (error) {
        toast.error("Trả lời bình luận thất bại");
        return;
      }
      setShowCommentCreateModal(false);
      toast.success(`Trả lời bình luận thành công!`);
      router.refresh();
    } else {
      if (!!comment.id) {
        const updateCommentreply = {
          feed_id: feedId as string,
          content: FormData.get("content") as string,
          user_id: user.id,
        };
        const { data, error } = await supabase
          .from("comments")
          .update(updateCommentreply)
          .eq("id", editing);
        if (error) {
          toast.error("Chỉnh sửa reply thất bại");
          return;
        }
        setShowCommentCreateModal(false);
        toast.success(`Chỉnh sửa reply thành công!`);
        router.refresh();
      }
    }
  };
  return (
    <form
      action={handleSubmit}
      onChange={handleChange}
      className={"flex gap-2.5"}
    >
      <div>
        <Avatar user={user?.user_metadata!} />
      </div>
      <div className="w-full">
        <div className="text-15 pl-2 font-semibold leading-[22.5px]">
          {user?.user_metadata?.full_name
            ? user?.user_metadata?.full_name
            : user?.user_metadata?.email}
        </div>
        {/* Schema fields start */}
        <div>
          <Textarea
            name="content"
            // rows={5}
            placeholder="Hãy nêu cảm nghĩ của bạn ở đây..."
            className={cn(
              errors?.content
                ? "ring-destructive ring"
                : "resize-none border-none focus:border-none",
            )}
            onChange={(e) => handleChangeContent(e.target.value)}
            // defaultValue={feed?.content! ?? ""}
          />
          {errors?.content ? (
            <p className="text-destructive mt-2 text-xs">{errors.content[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {/* Save Button */}
          <div
            className={`text-[15px] font-normal leading-[22.5px] ${countContent > maxCountContent ? "text-red-500" : "text-slate-500"}`}
          >
            {countContent > maxCountContent ? -countContent : countContent}/{" "}
            {maxCountContent}
          </div>
          <SaveButton
            errors={hasErrors}
            editing={editing}
            countContent={countContent}
          />
        </div>
      </div>
    </form>
  );
};

const SaveButton = ({
  editing,
  errors,
  countContent,
}: {
  editing: Boolean;
  errors: boolean;
  countContent: number;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className={cn(
        "rounded-full bg-slate-50 text-slate-300 hover:bg-slate-50",
        {
          "bg-slate-900 text-white hover:bg-slate-900":
            countContent > 0 && countContent <= 300,
        },
      )}
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing ? `Cập nhật` : "Đăng tải"}
    </Button>
  );
};
