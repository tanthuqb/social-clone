"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Divider,
  toast,
} from "@suzu/ui";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
        message: "Password must contain at least one number or special character",
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export default function UpdatePasswordForm() {
  const supabase = createClient();

  const { setShowLoginModal } = useContext(ModalContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function handleSubmit(dataFrom: z.infer<typeof formSchema>) {
        const { data, error } = await supabase.auth
          .updateUser({ password: dataFrom.password })
          if (error) {
            toast.error(error.message);
          } else {
            toast.success("Password created successfully");
            redirect("/");
          }
          
  }
  return (
    <>
      <div className="p-4 pb-2.5 md:p-[32px_16px_0px_16px]">
        <div className="mx-auto flex max-w-[358px] flex-col gap-5">
          <div className="text-[23px] font-semibold leading-7 text-slate-700">
            Create a new password!
          </div>
          <p>
            Enter the new password you want below. And don't forget it again 😉!
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-2.5"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-0 ring-1 ring-neutral-100"
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-0 ring-1 ring-neutral-100"
                        placeholder="Confirm password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className={`flex w-full flex-col items-start gap-1 self-stretch rounded-full border border-slate-100 p-2 ${form.getValues("passwordConfirm") && form.getValues("password") ? "bg-slate-900" : "bg-slate-300"}`}
                disabled={
                  form.getValues("passwordConfirm") &&
                  form.getValues("password")
                    ? false
                    : true
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
                    className={`flex-1 ${form.getValues("passwordConfirm") && form.getValues("password") ? "text-white" : "text-slate-500"} text-center text-[15px] font-semibold leading-6`}
                  >
                    Create password
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
        </div>
      </div>
      <Divider className="my-5 bg-black/10" />
      <div className="flex justify-center gap-2 pb-4 md:pb-[24px]">
        <span>Already have an account 🙄?</span>
        <strong
          onClick={() => setShowLoginModal(true)}
          className="cursor-pointer"
        >
          Log in
        </strong>
      </div>
    </>
  );
}
