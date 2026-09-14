export interface Batch {
  batchId: string;
  beekeeper: string;
  farm: string;
  origin: string;
  location: string;
  district?: string;
  state?: string;
  contact: string;
  honeyType: string;
  harvestDate: string;
  quantity: string;
  processingDate?: string;
  packagingDate: string;
  expiryDate: string;
}

const SEED_BATCHES: Batch[] = [
  {
    batchId: "HO-2026-001",
    beekeeper: "Ravi Kumar",
    farm: "Green Bee Farm",
    origin: "Pollachi, Tamil Nadu",
    location: "Pollachi, Tamil Nadu",
    district: "Coimbatore",
    state: "Tamil Nadu",
    contact: "+91 98765 43210",
    honeyType: "Multifloral Honey",
    harvestDate: "20 August 2026",
    quantity: "25 kg",
    processingDate: "22 August 2026",
    packagingDate: "24 August 2026",
    expiryDate: "24 August 2028",
  },
  {
    batchId: "HO-2026-002",
    beekeeper: "Meena Beekeepers",
    farm: "Golden Hive Apiary",
    origin: "Coimbatore, Tamil Nadu",
    location: "Coimbatore, Tamil Nadu",
    district: "Coimbatore",
    state: "Tamil Nadu",
    contact: "+91 98765 12345",
    honeyType: "Wildflower Honey",
    harvestDate: "28 August 2026",
    quantity: "20 kg",
    processingDate: "29 August 2026",
    packagingDate: "30 August 2026",
    expiryDate: "30 August 2028",
  },
];

const STORAGE_KEY = "honey-origin-batches";

export function loadBatches(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Batch[];
      // Merge in any seed batches not already stored (ids may differ)
      const ids = new Set(parsed.map((b) => b.batchId));
      const merged = [...parsed, ...SEED_BATCHES.filter((b) => !ids.has(b.batchId))];
      return merged;
    }
  } catch {
    // fall through to seed data
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BATCHES));
  return SEED_BATCHES;
}

export function lookupBatch(batchId: string): Batch | null {
  const id = batchId.trim().toUpperCase();
  const batches = loadBatches();
  return batches.find((b) => b.batchId.toUpperCase() === id) ?? null;
}

/** Extracts a Batch ID from scanned QR text, e.g. "Honey Origin | Batch ID: HO-2026-001" */
export function extractBatchId(scanned: string): string | null {
  const match = scanned.match(/HO-\d{4}-\d{3}/i);
  return match ? match[0].toUpperCase() : null;
}

/** Generates the next unique Batch ID, e.g. HO-2026-003. */
export function nextBatchId(): string {
  const batches = loadBatches();
  const max = batches.reduce((acc, b) => {
    const m = b.batchId.match(/^HO-(\d{4})-(\d{3,})$/i);
    const seq = m?.[2];
    return seq ? Math.max(acc, parseInt(seq, 10)) : acc;
  }, 0);
  return `HO-2026-${String(max + 1).padStart(3, "0")}`;
}

export function createBatch(data: Omit<Batch, "batchId">): Batch {
  const batches = loadBatches();
  const batch: Batch = { ...data, batchId: nextBatchId() };
  const stored = batches.filter((b) => b.batchId !== batch.batchId);
  stored.push(batch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return batch;
}

/** QR payload format used on honey bottles. */
export function qrPayload(batchId: string): string {
  return `Honey Origin | Batch ID: ${batchId}`;
}
