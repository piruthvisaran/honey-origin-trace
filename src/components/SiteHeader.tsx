import { Link, useRouterState } from "@tanstack/react-router";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary-foreground">
              <path
                d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M12 8v8M8.5 10.5h7M8.5 13.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Honey Origin
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-xs font-medium tracking-wide uppercase">
          <Link
            to="/"
            className={
              pathname === "/"
                ? "text-foreground underline decoration-accent decoration-2 underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Customer Verification
          </Link>
          <Link
            to="/create"
            className={
              pathname === "/create"
                ? "text-foreground underline decoration-accent decoration-2 underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Create Batch
          </Link>
        </nav>
      </div>
    </header>
  );
}
