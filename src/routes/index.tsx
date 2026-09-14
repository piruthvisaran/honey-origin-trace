import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { QrScanner } from "@/components/QrScanner";
import { NotFoundResult, VerifiedResult } from "@/components/VerificationResult";
import { extractBatchId, lookupBatch, type Batch } from "@/lib/batches";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Honey Origin — Verify Your Honey Batch" },
      {
        name: "description",
        content:
          "Scan the QR code on your honey bottle or enter the Batch ID to view registered beekeeper and honey batch information.",
      },
      { property: "og:title", content: "Honey Origin — Know where your honey comes from" },
      {
        property: "og:description",
        content:
          "Verify registered honey batches. Scan the QR code or enter your Batch ID to see beekeeper and batch details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type ResultState =
  | { status: "none" }
  | { status: "verified"; batch: Batch }
  | { status: "not-found"; batchId: string };

function Index() {
  const [tab, setTab] = useState<"scan" | "manual">("scan");
  const [batchIdInput, setBatchIdInput] = useState("");
  const [result, setResult] = useState<ResultState>({ status: "none" });

  function verify(batchId: string) {
    const id = batchId.trim().toUpperCase();
    if (!id) return;
    const batch = lookupBatch(id);
    setResult(batch ? { status: "verified", batch } : { status: "not-found", batchId: id });
  }

  function handleScan(text: string) {
    const id = extractBatchId(text);
    if (id) verify(id);
  }

  function reset() {
    setResult({ status: "none" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5">
        <section className="py-14 text-center sm:py-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-foreground/70 uppercase">
            Consumer Verification
          </p>
          <h1 className="mx-auto mt-3 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Know where your honey comes from.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Scan the QR code on your honey bottle or enter the Batch ID to view registered
            beekeeper and honey batch information.
          </p>
        </section>

        <section className="pb-20">
          {result.status === "verified" && (
            <VerifiedResult batch={result.batch} onReset={reset} />
          )}
          {result.status === "not-found" && (
            <NotFoundResult batchId={result.batchId} onReset={reset} />
          )}

          {result.status === "none" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div role="tablist" className="flex border-b border-border">
                {(
                  [
                    { id: "scan", label: "Scan QR" },
                    { id: "manual", label: "Enter Batch ID" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "border-b-2 border-accent bg-card text-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                {tab === "scan" ? (
                  <QrScanner onScan={handleScan} />
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      verify(batchIdInput);
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="batch-id" className="text-sm font-medium text-foreground">
                        Honey Batch ID
                      </label>
                      <input
                        id="batch-id"
                        type="text"
                        value={batchIdInput}
                        onChange={(e) => setBatchIdInput(e.target.value)}
                        placeholder="HO-2026-001"
                        autoComplete="off"
                        className="rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none"
                      />
                      <p className="text-xs text-muted-foreground">Example: HO-2026-001</p>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Verify
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            Honey Origin confirms that a Batch ID and its source details are registered in the
            system. It does not certify honey purity or laboratory quality.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <span className="text-xs text-muted-foreground">Honey Origin</span>
          <span className="text-xs text-muted-foreground">Honey traceability for consumers</span>
        </div>
      </footer>
    </div>
  );
}
