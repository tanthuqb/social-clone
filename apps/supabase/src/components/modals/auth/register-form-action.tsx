"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useContext } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Hãy nhập địa chỉ email chính xác dinh dạng admin@example.com",
    }),
    password: z
      .string()
      .min(8, {
        message: "Mật khẩu cần có độ dài tối thiểu ít nhất 8 ký tự.",
      })
      .regex(/[a-z]/, { message: "Mật khẩu phải có chữ cái viết thường" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất một chữ in hoa" })
      .regex(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
        message: "Mật khẩu phải có ít nhất một số hoặc ký tự đặc biệt",
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Mật khẩu không đồng bộ",
    path: ["passwordConfirm"],
  });

export default function RegisterFormAction() {
  const { setShowRegisterModal, setShowUpdateInfoUserModal } =
    useContext(ModalContext);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  async function signUpNewUser(dataForm: z.infer<typeof formSchema>) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: dataForm.email,
      password: dataForm.password,
      options: {
        emailRedirectTo: `${location.origin}`,
      },
    });
    if (!error) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataForm.email,
        password: dataForm.password,
      });
      return error;
    }
    return error;
  }

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {

    const authError = await signUpNewUser(data);
    console.log(authError);

    if (authError) return toast.error("Đăng ký thất bại");
    else {
      toast.success("Đăng ký thành công");
      setTimeout(() => {
        setShowUpdateInfoUserModal(true);
        setShowRegisterModal(false);
      }, 3000);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="mb-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nhập email"
                    type="text"
                    {...field}
                    className="border-0 ring-1 ring-neutral-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nhập mật khẩu"
                    type="password"
                    {...field}
                    className="border-0 ring-1 ring-neutral-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-2">
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    {...field}
                    className="border-0 ring-1 ring-neutral-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className={`flex w-full flex-col items-start gap-1 self-stretch rounded-full border border-slate-100 p-2 ${
            form.getValues("email") && form.getValues("password")
              ? "bg-slate-900"
              : "bg-slate-300"
          }`}
          disabled={
            form.getValues("email") && form.getValues("password") ? false : true
          }
          type="submit"
        >
          <div className="flex w-full gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            ></svg>
            <div
              className={`flex-1 ${form.getValues("email") && form.getValues("password") ? "text-white" : "text-slate-500"} text-center text-[15px] font-semibold leading-6`}
            >
              SuZu thuiii
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            ></svg>
          </div>
        </Button>
      </form>
    </Form>
  );
}