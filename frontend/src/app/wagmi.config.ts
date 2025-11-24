import {http} from "wagmi";
import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {sepolia, celoAlfajores, celo} from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
	appName: "Savium",
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
	chains: [
		celo,
		celoAlfajores,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
			? [sepolia]
			: []),
	],
	ssr: true,
	transports: {
		[celoAlfajores.id]: http("https://forno.celo-sepolia.celo-testnet.org"),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof wagmiConfig;
	}
}
