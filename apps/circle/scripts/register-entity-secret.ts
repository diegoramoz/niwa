import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";
import { env } from "@oss/env/circle";

const response = await registerEntitySecretCiphertext({
	apiKey: env.CIRCLE_API_KEY,
	entitySecret: env.CIRCLE_ENTITY_SECRET,
	recoveryFileDownloadPath: ".",
});

console.log(response.data?.recoveryFile);
