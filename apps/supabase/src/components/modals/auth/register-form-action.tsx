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
      message: "Please enter a valid email address, e.g. admin@example.com",
    }),
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
        emailRedirectTo: `${location.origin}/api/auth/emailcallback`,
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

    if (authError) return toast.error("Sign up failed");
    else {
      toast.success("Signed up successfully");
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

        <div className="mb-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter password"
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
                    placeholder="Confirm password"
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
              Sign up
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