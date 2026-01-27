"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";

type Props = {
  genres: string[];
  decades: string[];
  stations: string[];
};

export const MobileMenu = ({ genres, decades, stations }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="hamburger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="drawerOverlay" role="dialog" aria-modal="true">
          <button type="button" className="drawerBackdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="drawerPanel">
            <div className="drawerHeader">
              <div style={{ fontWeight: 800 }}>Filters</div>
              <button type="button" className="hamburger" aria-label="Close menu" onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <Sidebar genres={genres} decades={decades} stations={stations} />
          </div>
        </div>
      ) : null}
    </>
  );
};
