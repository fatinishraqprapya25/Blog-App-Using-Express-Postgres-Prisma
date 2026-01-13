import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                default: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                default: "active",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const html = `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email Verification</title>
  <style>
    /* (copy the styles from above) */
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email Address</h1>
    <p>Hi there,</p>
    <p>Thank you for signing up for Prisma Blog App! Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">Verify Email</a>
    <p>If you did not create an account, no further action is required.</p>
    <p>Cheers,<br />The Prisma Blog App Team</p>
    <div class="footer">
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">${verificationUrl}</a></p>
    </div>
  </div>
</body>
</html>
`;
                const info = await transporter.sendMail({
                    from: '"Prisma Blog App" <prisma.blog@gmail.com>',
                    to: user.email,
                    subject: "Please verify your email",
                    text: `Please verify your email by visiting this link: ${verificationUrl}`,
                    html,
                });
            } catch (err) {
                console.error(err);
                throw err;
            }

        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});