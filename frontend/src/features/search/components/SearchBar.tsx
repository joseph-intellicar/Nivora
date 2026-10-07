"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { paths } from "@/config/routes";

/**
 * Header search (requirements §13): keeps the current query in the box and opens the results
 * page. Clearing the search (the × button, Escape, or submitting an empty box) also leaves the
 * results page, since an empty search has no results to show. Backspacing alone only empties the
 * box, so the customer can type a new search without being navigated away mid-edit.
 */
export function SearchBar({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams().get("q") ?? "";
  const [value, setValue] = useState(current);
  const [synced, setSynced] = useState(current);
  const input = useRef<HTMLInputElement>(null);
  if (current !== synced) {
    // Navigated to a different search: show it in the box.
    setSynced(current);
    setValue(current);
  }

  const onResultsPage = pathname === paths.search() && current !== "";

  const clear = () => {
    setValue("");
    input.current?.focus();
    // The results page has nothing to show for an empty search (it redirects Home as well).
    if (onResultsPage) router.push(paths.home());
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = value.trim();
    if (!q) {
      clear();
      return;
    }
    router.push(paths.search(q));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && value) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <form
      role="search"
      action={paths.search()}
      method="get"
      onSubmit={submit}
      className="relative w-full"
    >
      <label htmlFor={id} className="sr-only">
        Search Nivora
      </label>
      <input
        ref={input}
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search for products, brands and more"
        className="h-11 w-full rounded-full bg-canvas pr-20 pl-4 text-sm text-ink ring-1 ring-line ring-inset placeholder:text-ink-subtle focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-11 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-line/60 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
        >
          <CloseIcon className="size-4" />
        </button>
      ) : null}
      <button
        type="submit"
        aria-label="Search"
        className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-700 text-white hover:bg-brand-800"
      >
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}
