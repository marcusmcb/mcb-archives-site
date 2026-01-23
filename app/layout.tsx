import "./globals.css";

import type { ReactNode } from "react";

import { Sidebar } from "../components/Sidebar";
import { getGenres } from "../lib/shows";

export const metadata = {
  title: "MCB Archives",
  description: "Archive of previously aired mixshow sets from djmarcusmcb"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const genres = await getGenres().catch(() => [] as string[]);

  return (
    <html lang="en">
      <body>
        <div className="mobileHeader">
          <div style={{ fontWeight: 800 }}>MCB Archives</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Menu in page</div>
        </div>

        <div className="container">
          <aside className="sidebar">
            <div className="brand">MCB Archives</div>
            <Sidebar genres={genres} />
          </aside>

          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
