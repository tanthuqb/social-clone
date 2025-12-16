"use client";
import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

import { useLoginModal } from "@/components/modals/auth/login-modal";
import { useRegisterModal } from "@/components/modals/auth/register-modal";
import { useFeedCreateModal } from "@/components/modals/feeds/feed-create-modal";
import { useForgotPasswordModal } from "./auth/forgot-password-modal";
import { useNoticationSupportModal } from "./notication-modal/support-success";
import { useCommentCreateModal } from "./comments/comment-create-modal";
import { useUpdateInfoUserModal } from "./updateInformation";
import { useFeedDeleteModal } from "./feeds/feed-delete-modal";
import { useNoticationForgotPassModal } from "./notication-modal/forgotpass-success";
import { useCancelFeedModalModal } from "./notication-modal/cancel-feed-modal";

export const ModalContext = createContext<{
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
  setShowFeedCreateModal: Dispatch<SetStateAction<boolean>>;
  setShowFeedDeleteModal: Dispatch<SetStateAction<boolean>>;
  setShowNoticationSupportModal: Dispatch<SetStateAction<boolean>>;
  setShowNoticationForgotPassModal: Dispatch<SetStateAction<boolean>>;
  setShowCancelFeedModal: Dispatch<SetStateAction<boolean>>;
  setShowForgotPasswordModal: Dispatch<SetStateAction<boolean>>;
  setShowUpdateInfoUserModal: Dispatch<SetStateAction<boolean>>;
  setCommentId: Dispatch<SetStateAction<string>>;
  setFeed: Dispatch<SetStateAction<any | undefined>>;
  setFeedDelete: Dispatch<SetStateAction<any | undefined>>;
  setShowCommentCreateModal: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<any | null>>;
  setComment: Dispatch<SetStateAction<any>>;
  setType: Dispatch<SetStateAction<boolean>>;
  setParentFeedId: Dispatch<SetStateAction<any>>;
  setUserProfile: Dispatch<SetStateAction<Profile | null>>;
  setSession: Dispatch<SetStateAction<Session | null>>;

}>({
  setShowCommentCreateModal: () => { },
  setShowLoginModal: () => { },
  setShowRegisterModal: () => { },
  setShowFeedCreateModal: () => { },
  setShowFeedDeleteModal: () => { },
  setShowNoticationSupportModal: () => { },
  setShowNoticationForgotPassModal: () => { },
  setShowCancelFeedModal: () => { },
  setShowForgotPasswordModal: () => { },
  setShowUpdateInfoUserModal: () => { },
  setComment: (comment) => {
    return comment;
  },
  setCommentId: (commentId) => {
    return commentId;
  },
  setFeed: (feed) => {
    return feed;
  },
  setFeedDelete: (feed) => {
    return feed;
  },
  setUser: (user) => {
    return user;
  },
  setType: (type) => {
    return type;
  },
  setParentFeedId: (parentFeedId) => {
    return parentFeedId;
  },
  setUserProfile: (userProfile) => {
    return userProfile;
  },
  setSession: (session) => {
    return session;
  },
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { setShowLoginModal, LoginModal } = useLoginModal();
  const { setShowRegisterModal, RegisterModal } = useRegisterModal();
  const { setShowForgotPasswordModal, ForgotPasswordModal } =
    useForgotPasswordModal();
  const { setShowNoticationSupportModal, NoticationSupportModal } =
    useNoticationSupportModal();
  const { setShowNoticationForgotPassModal, NoticationForgotPassModal } =
    useNoticationForgotPassModal();


  const {
    setShowFeedCreateModal,
    FeedCreateModal,
    setFeed,
    setType,
    setUserProfile,
    setParentFeedId,
    setSession
  } = useFeedCreateModal();



  const { setShowFeedDeleteModal, FeedDeleteModal, setFeedDelete } =
    useFeedDeleteModal();
  const {
    setShowCommentCreateModal,
    CommentCreateModal,
    setUser,
    setCommentId,
    setComment,
  } = useCommentCreateModal();
  const { setShowUpdateInfoUserModal, UpdateInfoUserModal } =
    useUpdateInfoUserModal();
  const { setShowCancelFeedModal, CancelFeedModal } = useCancelFeedModalModal();
  return (
    <ModalContext.Provider
      value={{
        setShowLoginModal,
        setShowRegisterModal,
        setShowFeedCreateModal,
        setShowFeedDeleteModal,
        setShowCommentCreateModal,
        setShowNoticationSupportModal,
        setShowNoticationForgotPassModal,
        setShowForgotPasswordModal,
        setShowUpdateInfoUserModal,
        setShowCancelFeedModal,
        setFeed,
        setFeedDelete,
        setUser,
        setCommentId,
        setComment,
        setType,
        setParentFeedId,
        setUserProfile,
        setSession,
      }}
    >
      <LoginModal />
      <RegisterModal />
      <FeedCreateModal />
      <FeedDeleteModal />
      <NoticationSupportModal />
      <ForgotPasswordModal />
      <NoticationForgotPassModal />
      <CommentCreateModal />
      <UpdateInfoUserModal />
      <CancelFeedModal />

      {children}
    </ModalContext.Provider>
  );
}
