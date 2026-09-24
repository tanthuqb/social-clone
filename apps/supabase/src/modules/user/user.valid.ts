import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const email = z.string().email({
  message: "Please enter a valid email address, e.g. admin@example.com",
});
const password = z.string().min(5, {
  message: "Password must be at least 5 characters.",
});

const SCHEMAS = {
  signInWithPassword: z.object({
    email,
    password,
  }),
};

export type UserSignInWithPassword = z.infer<typeof SCHEMAS.signInWithPassword>;

/** Form hook for the email/password login form. */
export function useSignInWithPasswordForm() {
  return useForm<UserSignInWithPassword>({
      resolver: zodResolver(SCHEMAS.signInWithPassword),
      defaultValues: {
        email: "",
        password: "",
      },
  });
}
