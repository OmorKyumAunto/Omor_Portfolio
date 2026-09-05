import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";

/** Primary UI + display face. Tight, editorial, high x-height. */
export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/** Signature accent. Used italic, for a single word at a time. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: ["400"],
  style: ["italic", "normal"],
});

/** Technical labels, eyebrows, indices and metadata. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const fontVariables = [
  interTight.variable,
  instrumentSerif.variable,
  jetbrainsMono.variable,
].join(" ");
