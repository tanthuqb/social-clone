"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useContext, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Success,
  toast,
} from "@suzu/ui";
import { ModalContext } from "@/components/modals/provider";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address, e.g. admin@example.com",
  }),
});

export default function ForgotPassForm() {
  const [email, setEmail] = useState<string>();
  const supabase = createClient();
  const { setShowForgotPasswordModal, setShowNoticationForgotPassModal } =
    useContext(ModalContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values) {
      // Handle a successful resend-email API call
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email as string,
        {
          redirectTo: `${location.origin}/api/auth/passwordcallback?next=/update-password`,
        },
      );
      if (error) {
        toast.error("Something went wrong");
        return;
      }
      setShowForgotPasswordModal(false);
      // toast.success("Check your email to verify")
      setShowNoticationForgotPassModal(true);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl onChange={(e: any) => setEmail(e?.target?.value)}>
                  <Input
                    placeholder="Enter email"
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

        <Button
          className={`flex w-full flex-col items-start gap-1 self-stretch rounded-full border border-slate-100 p-2 ${
            email ? "bg-slate-900" : "bg-slate-300"
          }`}
          type="submit"
          disabled={email ? false : true}
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
              className={`flex-1 ${
                email ? "text-white" : "text-slate-500"
              } text-center text-[15px] font-semibold leading-6`}
            >
              Send verification email
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
