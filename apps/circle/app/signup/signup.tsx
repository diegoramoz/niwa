"use client";

import { SignUpForm } from "@oss/ui/components/auth/sign-up-form";

export function Signup() {
	return (
		<div className="mx-auto mb-8 max-w-prose">
			<div>Create Account</div>

			<SignUpForm />
		</div>
	);
}
