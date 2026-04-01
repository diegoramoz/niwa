import { Geist, Geist_Mono } from "next/font/google";
import "../lib/orpc.server";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { APP } from "@/lib/metadata";
import { getBaseUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Serwist } from "./serwist";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: APP.displayName,
    template: `%s | ${APP.displayName}`,
  },
  description: APP.description,
  keywords: ["finance"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: APP.displayName,
    locale: APP.locale,
    title: APP.displayName,
    description: APP.description,
    url: "/",
    images: [
      {
        url: APP.defaultOgImagePath,
        width: 1200,
        height: 630,
        alt: `${APP.displayName} - Open Graph Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP.displayName,
    description: APP.description,
    images: [APP.defaultOgImagePath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  appleWebApp: {
    capable: true,
    title: APP.displayName,
    statusBarStyle: "default",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": APP.displayName,
    // Universal links for iOS
    "apple-itunes-app": "app-clip-bundle-id=com.app.clip",
  },
  applicationName: APP.displayName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "overscroll-none antialiased [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="overscroll-none">
        <ThemeProvider>
          <NuqsAdapter>
            <Serwist>{children}</Serwist>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
