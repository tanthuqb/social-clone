"use client";

import { ButtonExtras } from "@suzu/ui";
import { LoadingDots } from "@suzu/ui";
import { UserACtion } from "@/modules/user/user.action";

const SignInButton = () => {
  const { setShowLoginModal } = UserACtion();
  if (status === "loading") {
    return <LoadingDots />;
  }

  // if (session) {
  //   return;
  // }
  return (
    <ButtonExtras onClick={() => setShowLoginModal(true)} text="Sign In" />
  );
};

export { SignInButton };
