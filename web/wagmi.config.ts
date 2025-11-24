import {http} from "wagmi";
import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {sepolia, celoSepolia, celo} from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
	appName: "Savium",
	projectId: import.meta.env.VITE_PROJECT_ID || "",
	chains: [
		celo,
		celoSepolia,
		// ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
		// 	? [sepolia]
		// 	: []),
	],
	ssr: true,
});

declare module "wagmi" {
	interface Register {
		config: typeof wagmiConfig;
	}
}
