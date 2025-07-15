import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "@/db";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Allow automatic login after signup
  },
  plugins: [
    username(),
    emailOTP({
      sendVerificationOnSignUp: true, // Send verification emails on signup
      async sendVerificationOTP({ email, otp }) {
        console.log('Sending OTP email to:', email, 'OTP:', otp);
        try {
          const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: "Your verification code",
            html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
          });
          console.log('Email sent successfully:', result);
        } catch (error) {
          console.error('Failed to send email:', error);
          throw error;
        }
      },
    }),
  ],
});