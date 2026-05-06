"use client";

import { env } from "@oss/env/turnkey";
import { Toaster } from "@oss/ui/components/sonner";
import {
	type CreateSubOrgParams,
	TurnkeyProvider,
	type TurnkeyProviderConfig,
} from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const organizationId = env.NEXT_PUBLIC_ORGANIZATION_ID;
	const authProxyConfigId = env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID;

	if (!(organizationId && authProxyConfigId)) {
		throw new Error(
			"Missing NEXT_PUBLIC_ORGANIZATION_ID or NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID"
		);
	}

	const suborgParams = useMemo<CreateSubOrgParams>(() => {
		const ts = Date.now();
		return {
			userName: `User-${ts}`,
			customWallet: {
				walletName: `Wallet-${ts}`,
				walletAccounts: [
					{
						curve: "CURVE_SECP256K1",
						pathFormat: "PATH_FORMAT_BIP32",
						path: "m/44'/60'/0'/0/0",
						addressFormat: "ADDRESS_FORMAT_ETHEREUM",
					},
				],
			},
		};
	}, []);

	const turnkeyConfig: TurnkeyProviderConfig = {
		organizationId,
		authProxyConfigId,
		auth: {
			createSuborgParams: {
				emailOtpAuth: suborgParams,
				smsOtpAuth: suborgParams,
				walletAuth: suborgParams,
				oauth: suborgParams,
				passkeyAuth: { ...suborgParams, passkeyName: "My Passkey" },
			},
		},
	};

	return (
		<TurnkeyProvider
			callbacks={{
				onAuthenticationSuccess: () => router.push("/dashboard/setup"),
				onError: (error) => console.error("Turnkey error:", error),
			}}
			config={turnkeyConfig}
		>
			{children}
			<Toaster richColors />
		</TurnkeyProvider>
	);
}
