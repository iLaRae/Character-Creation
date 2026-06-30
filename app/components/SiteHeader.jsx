"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-[#061028] shadow-[0_8px_22px_-10px_rgba(56,189,248,0.9)] transition group-hover:scale-105">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.2 5.2L18 8.5l-4.8 1.3L12 15l-1.2-5.2L6 8.5l4.8-1.3L12 2Z"
            fill="currentColor"
          />
          <path
            d="M19 13l.6 2.4L22 16l-2.4.6L19 19l-.6-2.4L16 16l2.4-.6L19 13Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-[15px] font-extrabold tracking-tight text-white">
        Magic Sketch <span className="text-gradient">Studio</span>
      </span>
    </Link>
  );
}

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/#styles", label: "Styles" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#06081a]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/studio"
            className="hidden rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-4 py-2 text-sm font-bold text-[#061028] shadow-[0_12px_28px_-18px_rgba(56,189,248,0.9)] transition hover:brightness-110 active:scale-[.98] sm:inline-flex"
          >
            Open Studio
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white md:hidden"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-4 sm:px-6">
            <div className="flex flex-col gap-1 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-400 px-4 py-3 text-center text-sm font-bold text-[#061028]"
              >
                Open Studio
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
