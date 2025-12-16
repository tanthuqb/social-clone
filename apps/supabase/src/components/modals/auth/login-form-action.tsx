"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@suzu/ui";
import { UserACtion } from "@/modules/user/user.action";

export default function LoginFormAction({ setTypeFormModal }: any) {
  const {
    form,
    FormSignInWithPassword,
    setShowForgotPasswordModal,
    setShowLoginModal,
  } = UserACtion();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(FormSignInWithPassword)}>
        <div className="mb-2">
          <FormField
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

        <FormField
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

        <div className="mb-2.5 flex flex-col items-start gap-1 p-2">
          <div
            onClick={(event) => {
              setShowForgotPasswordModal(true);
              setShowLoginModal(false);
            }}
            className="cursor-pointer text-[15px] font-semibold leading-6 text-slate-900"
          >
            Quên mật khẩu
          </div>
        </div>

        <Button
          className={`flex w-full flex-col items-start gap-1 self-stretch rounded-full border border-slate-100 p-2 ${
            form.getValues("email") && form.getValues("password")
              ? "bg-slate-900"
              : "bg-slate-300"
          }`}
          type="submit"
          disabled={
            form.getValues("email") && form.getValues("password") ? false : true
          }
        >
          <div className="relative flex w-full gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            ></svg>
            <div
              className={`flex-1 ${
                form.getValues("email") && form.getValues("password")
                  ? "text-white"
                  : "text-slate-500"
              } text-center text-[15px] font-semibold leading-6`}
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
