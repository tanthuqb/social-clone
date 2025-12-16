import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const email = z.string().email({
  message: "Hãy nhập địa chỉ email chính xác dinh dạng admin@example.com",
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

export namespace UserType {
  export type UserSignInWithPassword = z.infer<
    typeof SCHEMAS.signInWithPassword
  >;
}

export const UserValid = {
  signInWithPassword: () =>
    useForm<UserType.UserSignInWithPassword>({
      resolver: zodResolver(SCHEMAS.signInWithPassword),
      defaultValues: {
        email: "",
        password: "",
      },
    }),
};
