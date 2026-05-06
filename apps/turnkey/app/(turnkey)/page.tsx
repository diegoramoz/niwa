"use client";
import { useTurnkey } from "@turnkey/react-wallet-kit";

function LoginButton() {
	const { handleLogin } = useTurnkey();

	const onLoginClick = () => {
		handleLogin();
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<h1 className="font-bold text-2xl text-gray-900">Agent Wallet Demo</h1>
			<p className="max-w-sm text-center text-gray-500 text-sm">
				Sign in to create your embedded wallet and configure an AI agent with
				policy-gated signing access.
			</p>
			<button
				className="rounded bg-slate-700 px-6 py-2.5 text-sm text-white hover:bg-slate-800"
				onClick={onLoginClick}
				type="button"
			>
				Login / Sign Up
			</button>
		</div>
	);
}

export default function Home() {
	return <LoginButton />;
}
