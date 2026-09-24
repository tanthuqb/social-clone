import { toast } from "@suzu/ui";
import { useSignInWithPasswordForm } from "./user.valid";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ModalContext } from "@/components/modals/provider";
import { Provider } from "@supabase/supabase-js";
import { ControllerResponse, ResponseStatus } from "@/lib/base/controller";
import { toastFeed } from "@/components/shared/toast-feed";

export const UserACtion = () => {
  const { setShowLoginModal, setShowForgotPasswordModal } =
    useContext(ModalContext);
  const router = useRouter();
  const form = useSignInWithPasswordForm();
  const [user, setUser] = useState<User | null>(null);

  // Same-origin API routes: works on any host/port (dev, preview, prod).
  const url = "";

  const GetUser = async () => {
    const data = await fetch(`${url}/api/auth/profile`);
    if (data.ok) {
      const { status, message, result } = await data.json();
      if (status !== ResponseStatus.Success) {
        toast.error(message!);
      } else {
        setUser(result.user);
      }
    }
  };

  const FormSignInWithPassword = async () => {
    const { email, password } = form.getValues();
    const data = await fetch(`${url}/api/auth/with-email`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.ok) {
      const { status } = await data.json();
      if (status !== ResponseStatus.Success) {
        toastFeed(
          "Login failed!",
        );
      } else {
        setShowLoginModal(false);
        router.refresh();
        toastFeed(
          "Logged in successfully!",
        );
      }
    } else {
      toast.error(data.statusText);
    }
  };

  const FormSignIWithOAuth = async (provider: Provider) => {
    const data = await fetch(`${url}/api/auth/with-oauth`, {
      method: "POST",
      body: JSON.stringify({ provider }),
    });
    if (data.ok) {
      const {
        status,
        result,
      }: ControllerResponse<{ url: string; provider: Provider }> =
        await data.json();
      if (status !== ResponseStatus.Success) {
        toastFeed(
          "Login failed!",
        );
      } else {
        router.replace(result!.url);
      }
    } else {
      toastFeed(
        "Login failed!",
      );
    }
  };

  const SignOut = async () => {
    await fetch(`${url}/api/auth/sign-out`);
    router.push("/");
    router.refresh();
  };

  return {
    user,
    form,
    GetUser,
    SignOut,
    setShowLoginModal,
    FormSignIWithOAuth,
    FormSignInWithPassword,
    setShowForgotPasswordModal,
  };
};
