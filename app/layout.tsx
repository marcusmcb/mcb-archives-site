import "./globals.css";

import type { ReactNode } from "react";
import { Suspense } from "react";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AudioPlayerProvider } from "../components/player/AudioPlayerProvider";
import { MobileMenu } from "../components/MobileMenu";
import { Sidebar } from "../components/Sidebar";
import { getDecades, getGenres, getStations } from "../lib/shows";

export const metadata = {
  title: "MCB Archives",
  description: "Archive of previously aired mixshow sets from djmarcusmcb"
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const genres = await getGenres().catch(() => [] as string[]);
  const decades = await getDecades().catch(() => [] as string[]);
  const stations = await getStations().catch(() => [] as string[]);

  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AudioPlayerProvider>
          <div className="mobileHeader">
            <div className="brandTitle">MCB Archives</div>
            <Suspense fallback={null}>
              <MobileMenu genres={genres} decades={decades} stations={stations} />
            </Suspense>
          </div>

          <div className="container">
            <aside className="sidebar">
              <div className="brand">MCB Archives</div>
              <Suspense fallback={null}>
                <Sidebar genres={genres} decades={decades} stations={stations} />
              </Suspense>
            </aside>

            <main className="main">{children}</main>
          </div>
        </AudioPlayerProvider>
      </body>
    </html>
  );
};

export default RootLayout;
