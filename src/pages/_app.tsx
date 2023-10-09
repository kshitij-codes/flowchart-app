import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../components/flowchart2/flowchart.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
