export interface Batch {
  batchId: string;
  beekeeper: string;
  farm: string;
  origin: string;
  location: string;
  contact: string;
  honeyType: string;
  harvestDate: string;
  quantity: string;
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
    contact: "+91 98765 43210",
    honeyType: "Multifloral Honey",
    harvestDate: "20 August 2026",
    quantity: "25 kg",
    packagingDate: "24 August 2026",
    expiryDate: "24 August 2028",
  },
  {
    batchId: "HO-2026-002",
    beekeeper: "Meena Beekeepers",
    farm: "Golden Hive Apiary",
    origin: "Coimbatore, Tamil Nadu",
    location: "Coimbatore, Tamil Nadu",
    contact: "+91 98765 12345",
    honeyType: "Wildflower Honey",
    harvestDate: "28 August 2026",
    quantity: "20 kg",
    packagingDate: "30 August 2026",
    expiryDate: "30 August 2028",
  },
];

const STORAGE_KEY = "honey-origin-batches";

function loadBatches(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Batch[];
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
