import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SiteHeader } from "@/components/SiteHeader";
import { createBatch, qrPayload, type Batch } from "@/lib/batches";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Honey Origin — Create New Honey Batch" },
      {
        name: "description",
        content:
          "Producer-side batch creation for Honey Origin. Register beekeeper and honey batch details, generate a unique Batch ID and QR code for the honey bottle.",
      },
      { property: "og:title", content: "Honey Origin — Create New Honey Batch" },
      {
        property: "og:description",
        content:
          "Register a honey batch, get a unique Batch ID and QR code for the bottle — ready for Honey Origin consumer verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateBatchPage,
});

const HONEY_TYPES = [
  "Multifloral Honey",
  "Wildflower Honey",
  "Eucalyptus Honey",
  "Acacia Honey",
  "Other",
];

const batchSchema = z.object({
  beekeeper: z.string().trim().min(1, "Beekeeper name is required").max(100),
  farm: z.string().trim().min(1, "Farm / Apiary name is required").max(100),
  contact: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .max(20)
    .regex(/^[+\d][\d\s-]{6,19}$/, "Enter a valid contact number"),
  location: z.string().trim().min(1, "Location is required").max(100),
  district: z.string().trim().min(1, "District is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  honeyType: z.string().trim().min(1, "Honey type is required").max(60),
  origin: z.string().trim().min(1, "Honey origin is required").max(100),
  harvestDate: z.string().min(1, "Harvest date is required"),
  quantity: z.string().trim().min(1, "Quantity is required").max(30),
  processingDate: z.string().min(1, "Processing date is required"),
  packagingDate: z.string().min(1, "Packaging date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type BatchForm = z.infer<typeof batchSchema>;

const EMPTY_FORM: BatchForm = {
  beekeeper: "",
  farm: "",
  contact: "",
  location: "",
  district: "",
  state: "",
  honeyType: "",
  origin: "",
  harvestDate: "",
  quantity: "",
  processingDate: "",
  packagingDate: "",
  expiryDate: "",
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const inputClass =
  "rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-2.5 last:border-b-0">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function CreateBatchPage() {
  const [form, setForm] = useState<BatchForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof BatchForm, string>>>({});
  const [created, setCreated] = useState<Batch | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  function set<K extends keyof BatchForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = batchSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BatchForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BatchForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const batch = createBatch({
      beekeeper: d.beekeeper,
      farm: d.farm,
      contact: d.contact,
      location: d.location,
      district: d.district,
      state: d.state,
      honeyType: d.honeyType,
      origin: d.origin,
      harvestDate: formatDate(d.harvestDate),
      quantity: d.quantity,
      processingDate: formatDate(d.processingDate),
      packagingDate: formatDate(d.packagingDate),
      expiryDate: formatDate(d.expiryDate),
    });
    const { toDataURL } = await import("qrcode");
    const url = await toDataURL(qrPayload(batch.batchId), {
      width: 640,
      margin: 2,
      color: { dark: "#3d2b16", light: "#ffffff" },
    });
    setQrDataUrl(url);
    setCreated(batch);
    window.scrollTo({ top: 0 });
  }

  function downloadQr() {
    if (!qrDataUrl || !created) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${created.batchId}-qr.png`;
    a.click();
  }

  function printQr() {
    window.print();
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setCreated(null);
    setQrDataUrl(null);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5">
        {!created ? (
          <>
            <section className="py-12 text-center sm:py-16">
              <p className="text-xs font-semibold tracking-[0.2em] text-accent-foreground/70 uppercase">
                Producer Module
              </p>
              <h1 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Create New Honey Batch
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Register beekeeper and honey production details. The system generates a unique
                Batch ID and QR code for the honey bottle.
              </p>
            </section>

            <form onSubmit={handleSubmit} className="pb-20" noValidate>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-6 py-4 sm:px-8">
                  <h2 className="text-base font-semibold text-foreground">Beekeeper Details</h2>
                </div>
                <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
                  <Field label="Beekeeper Name" error={errors.beekeeper}>
                    <input className={inputClass} value={form.beekeeper} onChange={(e) => set("beekeeper", e.target.value)} placeholder="Ravi Kumar" maxLength={100} />
                  </Field>
                  <Field label="Farm / Apiary Name" error={errors.farm}>
                    <input className={inputClass} value={form.farm} onChange={(e) => set("farm", e.target.value)} placeholder="Green Bee Farm" maxLength={100} />
                  </Field>
                  <Field label="Contact Number" error={errors.contact}>
                    <input className={inputClass} value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="+91 98765 43210" maxLength={20} />
                  </Field>
                  <Field label="Location" error={errors.location}>
                    <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Pollachi" maxLength={100} />
                  </Field>
                  <Field label="District" error={errors.district}>
                    <input className={inputClass} value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Coimbatore" maxLength={100} />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Tamil Nadu" maxLength={100} />
                  </Field>
                </div>

                <div className="border-t border-b border-border px-6 py-4 sm:px-8">
                  <h2 className="text-base font-semibold text-foreground">Honey Batch Details</h2>
                </div>
                <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
                  <Field label="Honey Type" error={errors.honeyType}>
                    <select className={inputClass} value={form.honeyType} onChange={(e) => set("honeyType", e.target.value)}>
                      <option value="">Select honey type</option>
                      {HONEY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Honey Origin" error={errors.origin}>
                    <input className={inputClass} value={form.origin} onChange={(e) => set("origin", e.target.value)} placeholder="Pollachi, Tamil Nadu" maxLength={100} />
                  </Field>
                  <Field label="Harvest Date" error={errors.harvestDate}>
                    <input type="date" className={inputClass} value={form.harvestDate} onChange={(e) => set("harvestDate", e.target.value)} />
                  </Field>
                  <Field label="Quantity" error={errors.quantity}>
                    <input className={inputClass} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="25 kg" maxLength={30} />
                  </Field>
                  <Field label="Processing Date" error={errors.processingDate}>
                    <input type="date" className={inputClass} value={form.processingDate} onChange={(e) => set("processingDate", e.target.value)} />
                  </Field>
                  <Field label="Packaging Date" error={errors.packagingDate}>
                    <input type="date" className={inputClass} value={form.packagingDate} onChange={(e) => set("packagingDate", e.target.value)} />
                  </Field>
                  <Field label="Expiry Date" error={errors.expiryDate}>
                    <input type="date" className={inputClass} value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} />
                  </Field>
                </div>

                <div className="border-t border-border px-6 py-5 sm:px-8">
                  <p className="mb-4 text-xs text-muted-foreground">
                    The Batch ID is generated automatically (e.g. HO-2026-003) and must not be
                    entered manually.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Create Batch
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <section className="py-12 sm:py-16">
            <div className="mb-8 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success text-success-foreground">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Honey Batch Created Successfully
              </h1>
              <p className="mt-2 font-mono text-sm font-semibold text-foreground">
                Batch ID: {created.batchId}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-sm font-semibold text-foreground">Batch Record</h2>
                </div>
                <div className="px-6 py-3">
                  <DetailRow label="Batch ID" value={created.batchId} />
                  <DetailRow label="Beekeeper" value={created.beekeeper} />
                  <DetailRow label="Farm" value={created.farm} />
                  <DetailRow label="Location" value={`${created.location}, ${created.state ?? ""}`.replace(/, $/, "")} />
                  <DetailRow label="Honey Type" value={created.honeyType} />
                  <DetailRow label="Harvest Date" value={created.harvestDate} />
                  <DetailRow label="Quantity" value={created.quantity} />
                  <DetailRow label="Packaging Date" value={created.packagingDate} />
                  <DetailRow label="Expiry Date" value={created.expiryDate} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-6 py-4">
                  <h2 className="text-sm font-semibold text-success">QR CODE GENERATED</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Batch ID: {created.batchId}</p>
                </div>
                <div className="flex flex-col items-center gap-4 px-6 py-6" id="qr-print-area">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for batch ${created.batchId}`}
                      className="size-48 rounded-md border border-border"
                    />
                  )}
                  <p className="text-center text-xs text-muted-foreground">
                    Print and place this QR code on the honey bottle. Customers scan it to verify
                    the batch in Honey Origin.
                  </p>
                </div>
                <div className="grid gap-2 border-t border-border px-6 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={downloadQr}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Download QR
                    </button>
                    <button
                      onClick={printQr}
                      className="inline-flex items-center justify-center rounded-md border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Print QR
                    </button>
                  </div>
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Create Another Batch
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
              Part of Honey Chain — the producer-side entry point: Beekeeper → Create Batch →
              Unique Batch ID → QR Code → Honey Bottle → Consumer Verification.
            </p>
          </section>
        )}
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
