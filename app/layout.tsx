import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "BaseMint",
  description: "The ultimate token launchpad for Farcaster and Base",
  other: {
    "fc:frame": JSON.stringify({
      version: "1",
      name: "BaseMint",
      imageUrl: "https://v0-base-mint-app.vercel.app/og.png",
      button: {
        title: "Launch BaseMint",
        action: {
          type: "launch_frame",
          name: "BaseMint",
          url: "https://v0-base-mint-app.vercel.app",
          splashImageUrl: "https://v0-base-mint-app.vercel.app/splash.png",
          splashBackgroundColor: "#050505",
        },
      },
    }),
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}