import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import SessionProviderWrapper from "@/components/sessionprovider";
import Head from "next/head";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Add any other meta tags or links needed here */}
      </Head>
      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          fontSans.variable
        )}
      >
        <Theme>
          <SessionProviderWrapper>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <div className="relative  bg-background flex flex-col h-screen">
                <Navbar />
                <main className="container bg-background mx-auto max-w-7xl pt-16 px-6 flex-grow">
                  {children}
                </main>
              </div>
            </Providers>
          </SessionProviderWrapper>
        </Theme>
      </body>
    </html>
  );
}
