"use client";


import { useContext } from "react";
import { DropdownMenuItem } from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

type PropsButton = 'Register' | 'Login' | 'Support' | 'Error'

const AuthenticationButton = ({ className, props }: { className?: string, props?: PropsButton }) => {
  const { setShowRegisterModal, setShowLoginModal } =
    useContext(ModalContext);

  const handlelogin = async () => {
    const supabase = createClient()
    const { data: session } = await supabase.auth.getUser()
    if (
      session.user === null) {
      if (props === 'Register') {
        setShowRegisterModal(true);
      } else {
        setShowLoginModal(true);
      }
    }
  }


  return (
    props === 'Register' ? (
      <div role="button" onClick={handlelogin}>
        <DropdownMenuItem className="cursor-pointer text-[15px] text-[#0F172A]">
          Đăng ký tài khoản!
        </DropdownMenuItem>
      </div>
    ) : props === 'Login' ? (
      <div role="button" onClick={handlelogin}>
        <DropdownMenuItem className="cursor-pointer text-[15px] text-[#0F172A]">
          Vào SuZu!
        </DropdownMenuItem>
      </div>) :
      props === 'Support' ? (
        <div role="button" onClick={handlelogin}>
          <DropdownMenuItem className="cursor-pointer text-[15px] text-[#0F172A]">
            Hỗ trợ
          </DropdownMenuItem>
        </div>) :
        props === 'Error' && (
          <div role="button" onClick={handlelogin}>
            <DropdownMenuItem className="cursor-pointer text-[15px] text-[#0F172A]">
              Báo lỗi
            </DropdownMenuItem>
          </div>)
  );
};

export { AuthenticationButton };
