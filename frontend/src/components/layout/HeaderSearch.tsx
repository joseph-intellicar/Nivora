import { SearchIcon } from "@/components/icons";
import { paths } from "@/config/routes";

/**
 * Plain GET search form: works without JavaScript and is the fallback while the interactive
 * SearchBar (features/search) loads.
 */
export function HeaderSearch({ id }: { id: string }) {
  return (
    <form role="search" action={paths.search()} method="get" className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Search Nivora
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
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
