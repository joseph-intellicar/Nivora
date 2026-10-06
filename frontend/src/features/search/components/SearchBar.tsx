"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { paths } from "@/config/routes";

/**
 * Header search (requirements §13): keeps the current query in the box, ignores empty input,
 * and opens the results page.
 */
export function SearchBar({ id }: { id: string }) {
  const router = useRouter();
  const current = useSearchParams().get("q") ?? "";
  const [value, setValue] = useState(current);
  const [synced, setSynced] = useState(current);
  if (current !== synced) {
    // Navigated to a different search: show it in the box.
    setSynced(current);
    setValue(current);
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(paths.search(q));
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
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for products, brands and more"
        className="h-11 w-full rounded-full bg-canvas pr-12 pl-4 text-sm text-ink ring-1 ring-line ring-inset placeholder:text-ink-subtle focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      />
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
