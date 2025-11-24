import {createConfig, http} from "wagmi";
import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {
	arbitrum,
	base,
	mainnet,
	optimism,
	polygon,
	sepolia,
	celoAlfajores,
} from "wagmi/chains";

// export const wagmiConfig = createConfig({
// 	chains: [celoAlfajores],
// 	connectors: [
// 		metaMask({
// 			dappMetadata: {
// 				name: process.env.NEXT_PUBLIC_PROJECT_NAME,
// 			},
// 		}),
// 		injected(),
// 	],
// 	ssr: false,
// 	transports: {
// 		[celoAlfajores.id]: http(),
// 	},
// });

export const wagmiConfig = getDefaultConfig({
	appName: "Savium",
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
	chains: [
		celoAlfajores,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
			? [sepolia]
			: []),
	],
	ssr: true,
});

declare module "wagmi" {
	interface Register {
		config: typeof wagmiConfig;
	}
}
