"use client";
import { CloseIcon, Modal } from "@suzu/ui";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ButtonExtras as Button } from "@suzu/ui";
import { CommentCreateForm } from "./comment-create-form";

function CommentCreateModal({
  showCommentCreateModal,
  setShowCommentCreateModal,
  user,
  commentId,
  comment,
  parentCommentId,
}: {
  showCommentCreateModal: boolean;
  setShowCommentCreateModal: Dispatch<SetStateAction<boolean>>;
  user: any;
  setUser?: Dispatch<SetStateAction<null>>;
  comment: any
  setComment: Dispatch<SetStateAction<any>>;
  parentCommentId?: string;
  setParentCommentId?: Dispatch<SetStateAction<string>>;
  commentId?: string | null;
  setCommentId?: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Modal
      showModal={showCommentCreateModal}
      setShowModal={setShowCommentCreateModal}
    >
      <div className="flex flex-col items-start self-stretch w-full gap-1 p-2 rounded-full">
        <div className="flex items-center w-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          ></svg>
          <div className="flex-1 text-center text-[15px] font-semibold leading-6 text-white">
            {comment ? "Trả lời bình luận" : "Bình luận bài viết"}
          </div>
          <div onClick={() => setShowCommentCreateModal(false)}>
            <CloseIcon className="flex items-center justify-center text-center cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full overflow-hidden sm:rounded-2xl sm:shadow-xl">
        <div className="p-4 bg-white ">
          <Suspense
            fallback={
              <>
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <Button disabled={true} text="" variant="secondary" />
                <div className="w-3/4 h-5 mx-auto bg-gray-100 rounded-lg" />
              </>
            }
          >
            {/* <CommentCreateForm user={user!} commentId={commentId} comment={comment} /> */}
          </Suspense>
        </div>
      </div>
    </Modal>
  );
}

export function useCommentCreateModal() {
  const [showCommentCreateModal, setShowCommentCreateModal] = useState(false);
  const [user, setUser] = useState(null);
  const [feedId, setFeedId] = useState("");
  const [comment, setComment] = useState<any>(null);
  const [parentCommentId, setParentCommentId] = useState("");
  const [commentId, setCommentId] = useState("");

  const CommentCreateModalCallback = useCallback(() => {
    return (
      <CommentCreateModal
        showCommentCreateModal={showCommentCreateModal}
        setShowCommentCreateModal={setShowCommentCreateModal}
        user={user}
        setUser={setUser}
        commentId={commentId}
        setCommentId={setCommentId}
        comment={comment}
        setComment={setComment}
        parentCommentId={parentCommentId}
        setParentCommentId={setParentCommentId}
      />
    );
  }, [showCommentCreateModal, setShowCommentCreateModal, user, setUser, commentId, setCommentId, comment, setComment, parentCommentId, setParentCommentId]);

  return useMemo(
    () => ({
      setShowCommentCreateModal,
      CommentCreateModal: CommentCreateModalCallback,
      setUser,
      setCommentId,
      setComment,
      setParentCommentId,
    }),
    [setShowCommentCreateModal, CommentCreateModalCallback],
  );
}
