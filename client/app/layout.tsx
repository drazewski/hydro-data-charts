import "@mantine/core/styles.css";
import "./globals.css";
import localFont from "next/font/local";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import Header from "./components/header/Header";

const juraMedium = localFont({
  src: "./fonts/Jura/static/Jura-Medium.ttf",
  variable: "--font-jura-medium",
  weight: "500",
});
const juraBold = localFont({
  src: "./fonts/Jura/static/Jura-Bold.ttf",
  variable: "--font-jura-bold",
  weight: "600",
});
const montserrat = localFont({
  src: "./fonts/Montserrat/static/Montserrat-Medium.ttf",
  variable: "--font-montserrat-medium",
  weight: "400",
});
const montserratLight = localFont({
  src: "./fonts/Montserrat/static/Montserrat-Light.ttf",
  variable: "--font-montserrat-medium-light",
  weight: "300",
});

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={`${juraMedium.variable} ${juraBold.variable} ${montserrat.variable} ${montserratLight.variable}`}>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
