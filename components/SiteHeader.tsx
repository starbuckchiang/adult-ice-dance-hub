"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isDropdownCategory, navCategories, searchIndex, type NavCategory } from "@/lib/navigation";
import { SITE_NAME_EN, SITE_NAME_ZH } from "@/lib/site";
import styles from "./SiteHeader.module.css";

function isCurrent(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const openedAt = useRef(0);
  const openMenuRef = useRef<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-nav-open", menuOpen);
    return () => document.documentElement.removeAttribute("data-nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    openMenuRef.current = openMenu;
  }, [openMenu]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const current = openMenuRef.current;
        setSearchOpen(false);
        setOpenMenu(null);
        setMenuOpen(false);
        if (current) triggerRefs.current[current]?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const results = query.trim()
    ? searchIndex.filter((item) => item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 8)
    : searchIndex.slice(0, 6);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandEm}>{SITE_NAME_EN}</span>
          <span className={styles.brandZh}>{SITE_NAME_ZH}</span>
        </Link>
        <nav ref={desktopNavRef} className={styles.desktopNav} aria-label="主要導覽">
          {navCategories.map((category) =>
            isDropdownCategory(category) ? (
              <div
                key={category.id}
                className={styles.menu}
                onMouseEnter={() => {
                  openedAt.current = Date.now();
                  setOpenMenu(category.id);
                }}
              >
                <button
                  ref={(node) => {
                    triggerRefs.current[category.id] = node;
                  }}
                  className={styles.link}
                  type="button"
                  aria-expanded={openMenu === category.id}
                  aria-controls={`menu-${category.id}`}
                  aria-haspopup="menu"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpenMenu(category.id);
                    }
                  }}
                  onClick={() => {
                    if (Date.now() - openedAt.current < 500) {
                      setOpenMenu(category.id);
                      return;
                    }
                    setOpenMenu((current) => (current === category.id ? null : category.id));
                  }}
                >
                  {category.label}
                </button>
                <div
                  id={`menu-${category.id}`}
                  className={styles.dropdown}
                  role="menu"
                  aria-label={category.label}
                  hidden={openMenu !== category.id}
                >
                  {category.children?.map((link) => (
                    <Link key={`${link.href}-${link.label}`} className={styles.dropLink} href={link.href} role="menuitem">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={category.id} className={styles.link} href={category.overviewHref ?? "/"}>
                {category.label}
              </Link>
            ),
          )}
        </nav>
        <div className={styles.tools}>
          <button
            className={styles.iconButton}
            type="button"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            onClick={() => {
              setSearchOpen((value) => !value);
              setMenuOpen(false);
            }}
          >
            <SearchIcon />
            <span className={styles.searchLabel}>搜尋</span>
          </button>
          <button
            className={styles.toggle}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => {
              setMenuOpen((value) => !value);
              setSearchOpen(false);
            }}
          >
            <span className={styles.srOnly}>{menuOpen ? "關閉選單" : "開啟選單"}</span>
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {searchOpen ? (
        <div className={styles.searchPanel} id={searchId}>
          <label className={styles.srOnly} htmlFor={`${searchId}-input`}>
            搜尋全站
          </label>
          <input
            id={`${searchId}-input`}
            ref={searchRef}
            className={styles.searchInput}
            value={query}
            placeholder="搜尋頁面"
            onChange={(event) => setQuery(event.target.value)}
          />
          <ul className={styles.searchList}>
            {results.length > 0 ? (
              results.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))
            ) : (
              <li className={styles.searchEmpty}>沒有符合的頁面</li>
            )}
          </ul>
        </div>
      ) : null}
      <nav id="site-nav" className={styles.mobileNav} aria-label="手機導覽" hidden={!menuOpen}>
        {navCategories.map((category) => (
          <MobileGroup key={category.id} category={category} pathname={pathname} />
        ))}
      </nav>
    </header>
  );
}

function MobileGroup({ category, pathname }: { category: NavCategory; pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = `mobile-${category.id}`;
  if (!isDropdownCategory(category)) {
    return (
      <Link className={styles.mobileSummary} href={category.overviewHref ?? "/"}>
        {category.label}
      </Link>
    );
  }
  return (
    <div className={styles.mobileGroup}>
      <button
        className={styles.mobileSummary}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {category.label}
      </button>
      <div id={panelId} className={styles.mobileLinks} hidden={!open}>
        {category.children?.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} aria-current={isCurrent(pathname, link.href) ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
