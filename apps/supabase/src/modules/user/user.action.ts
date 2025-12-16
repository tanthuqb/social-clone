import { toast } from "@suzu/ui";
import { UserValid } from "./user.valid";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ModalContext } from "@/components/modals/provider";
import { Provider } from "@supabase/supabase-js";
import { ControllerResponse, ResponseStatus } from "@/lib/base/controller";
import { toastFeed } from "@/app/(app)/(outside)/toast/toast";

export const UserACtion = () => {
  const { setShowLoginModal, setShowForgotPasswordModal } =
    useContext(ModalContext);
  const router = useRouter();
  const { signInWithPassword } = UserValid;
  const form = signInWithPassword();
  const [user, setUser] = useState<User | null>(null);

  const isProduction = process.env.NODE_ENV === 'production';
  const url = isProduction ? 'https://dev.suzu.net' : 'http://localhost:3000';

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
          "Login thất bại!",
        );
      } else {
        setShowLoginModal(false);
        router.refresh();
        toastFeed(
          "Login thành công!",
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
          "Login thất bại!",
        );
      } else {
        router.replace(result!.url);
      }
    } else {
      toastFeed(
        "Login thất bại!",
      );
    }
  };

  const SignOut = async () => {
    await fetch(`${url}/api/auth/sign-out`);
    router.push("/");
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
