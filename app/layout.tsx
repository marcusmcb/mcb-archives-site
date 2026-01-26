import "./globals.css";

import type { ReactNode } from "react";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { MobileMenu } from "../components/MobileMenu";
import { Sidebar } from "../components/Sidebar";
import { getDecades, getGenres } from "../lib/shows";

export const metadata = {
  title: "MCB Archives",
  description: "Archive of previously aired mixshow sets from djmarcusmcb"
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const genres = await getGenres().catch(() => [] as string[]);
  const decades = await getDecades().catch(() => [] as string[]);

  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <div className="mobileHeader">
          <div style={{ fontWeight: 800 }}>MCB Archives</div>
          <MobileMenu genres={genres} decades={decades} />
        </div>

        <div className="container">
          <aside className="sidebar">
            <div className="brand">MCB Archives</div>
            <Sidebar genres={genres} decades={decades} />
          </aside>

          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
