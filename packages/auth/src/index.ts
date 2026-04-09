import { expo } from "@better-auth/expo";
import { passkey } from "@better-auth/passkey";
import { createDb } from "@oss/db";
import schema from "@oss/db/schema";
import { env } from "@oss/env/server";
import { ResetPassword } from "@oss/ui/components/emails/finance/reset-password";
import { VerifyEmail } from "@oss/ui/components/emails/finance/verify-email";
import { render } from "@react-email/render";
// import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";

// import { polarClient } from "./lib/payments";

const resend = new Resend(env.RESEND_API_KEY);

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema,
		}),
		advanced: {
			database: {
				generateId: "serial",
			},
		},
		trustedOrigins: [
			env.CORS_ORIGIN,
			"oss://",
			...(env.NODE_ENV === "development"
				? [
						"exp://",
						"exp://**",
						"exp://192.168.*.*:*/**",
						"http://localhost:8081",
					]
				: []),
		],
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			sendResetPassword: async ({ user, url }) => {
				try {
					const emailHtml = await render(ResetPassword({ resetUrl: url }));

					await resend.emails.send({
						// from: `${APP.displayName} <no-reply@${APP.domain}>`,
						from: "Acme <onboarding@resend.dev>",
						to: [user.email],
						subject: "Reset your password",
						html: emailHtml,
					});
				} catch (error) {
					console.error("Error sending password reset email:", error);
				}
			},
		},
		emailVerification: {
			sendVerificationEmail: async ({ user, url }) => {
				try {
					const emailHtml = await render(VerifyEmail({ verificationUrl: url }));

					await resend.emails.send({
						// from: `${APP.displayName} <no-reply@${APP.domain}>`,
						from: "Acme <onboarding@resend.dev>",
						to: [user.email],
						subject: "Verify your email address",
						html: emailHtml,
					});
				} catch (error) {
					console.error("Error sending verification email:", error);
				}
			},
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: true,
					defaultValue: "user",
					input: false,
				},
			},
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		plugins: [
			// polar({
			// 	client: polarClient,
			// 	createCustomerOnSignUp: true,
			// 	enableCustomerPortal: true,
			// 	use: [
			// 		checkout({
			// 			products: [
			// 				{
			// 					productId: "your-product-id",
			// 					slug: "pro",
			// 				},
			// 			],
			// 			successUrl: env.POLAR_SUCCESS_URL,
			// 			authenticatedUsersOnly: true,
			// 		}),
			// 		portal(),
			// 	],
			// }),
			nextCookies(),
			expo(),
			passkey(),
		],
	});
}

export const auth = createAuth();
