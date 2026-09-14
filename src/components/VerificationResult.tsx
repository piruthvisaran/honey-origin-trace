import type { Batch } from "@/lib/batches";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">{value}</dd>
    </div>
  );
}

export function VerifiedResult({ batch, onReset }: { batch: Batch; onReset: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-success text-success-foreground">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-success">REGISTERED BATCH</p>
            <p className="text-lg font-semibold text-foreground">{batch.batchId}</p>
          </div>
        </div>
      </div>
      <dl className="px-6 py-2 sm:px-8">
        <Row label="Beekeeper" value={batch.beekeeper} />
        <Row label="Farm / Apiary" value={batch.farm} />
        <Row label="Origin" value={batch.origin} />
        <Row label="Location" value={batch.location} />
        <Row label="Contact" value={batch.contact} />
        <Row label="Honey Type" value={batch.honeyType} />
        <Row label="Harvest Date" value={batch.harvestDate} />
        <Row label="Quantity" value={batch.quantity} />
        <Row label="Packaging Date" value={batch.packagingDate} />
        <Row label="Expiry Date" value={batch.expiryDate} />
      </dl>
      <div className="border-t border-border bg-secondary/60 px-6 py-4 sm:px-8">
        <p className="text-xs leading-relaxed text-muted-foreground">
          The batch information is registered in the Honey Origin system. This confirms the
          registered source and batch details only — it is not a statement about honey purity
          or laboratory quality.
        </p>
        <button
          onClick={onReset}
          className="mt-3 text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Verify another batch
        </button>
      </div>
    </div>
  );
}

export function NotFoundResult({ batchId, onReset }: { batchId: string; onReset: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="px-6 py-8 text-center sm:px-8">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <p className="mt-4 text-sm font-semibold tracking-wide text-destructive">BATCH NOT FOUND</p>
        {batchId && (
          <p className="mt-1 font-mono text-sm text-muted-foreground">{batchId}</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          This Batch ID is not registered in Honey Origin.
        </p>
        <button
          onClick={onReset}
          className="mt-5 text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
