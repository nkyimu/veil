import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Veil",
  projectId: "fd64b75c8f76a8fac86e2c46ed11cfe3",
  chains: [baseSepolia],
  ssr: true, // Defer localStorage access to client — required for Next.js prerender
});
