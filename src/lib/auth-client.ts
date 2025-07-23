import { createAuthClient } from "better-auth/react";
import { usernameClient, emailOTPClient, captchaClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "",
  plugins: [
    usernameClient(),
    emailOTPClient(),
    captchaClient(),
  ],
});

export const { useSession, signIn, signUp, signOut, $Infer } = authClient;