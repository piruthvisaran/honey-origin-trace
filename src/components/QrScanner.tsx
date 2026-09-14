import { useEffect, useRef, useState } from "react";

interface QrScannerProps {
  onScan: (text: string) => void;
}

type ScannerState = "idle" | "starting" | "scanning" | "error";

export function QrScanner({ onScan }: QrScannerProps) {
  const regionId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const [state, setState] = useState<ScannerState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner
          .stop()
          .catch(() => undefined)
          .then(() => scanner.clear());
      }
    };
  }, []);

  async function startScanner() {
    setState("starting");
    setErrorMessage("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(regionId.current);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          onScanRef.current(decodedText);
          const s = scannerRef.current;
          if (s) {
            s.stop()
              .catch(() => undefined)
              .then(() => s.clear());
            scannerRef.current = null;
          }
          setState("idle");
        },
        () => undefined
      );
      setState("scanning");
    } catch (err) {
      scannerRef.current = null;
      setState("error");
      setErrorMessage(
        err instanceof Error && /permission|denied|notallowed/i.test(err.message)
          ? "Camera permission was denied. Please allow camera access and try again."
          : "Could not access the camera. You can enter the Batch ID manually instead."
      );
    }
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      await scanner.stop().catch(() => undefined);
      scanner.clear();
    }
    setState("idle");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-lg border border-border bg-secondary/50">
        {state === "idle" && (
          <div className="flex aspect-square max-h-72 w-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-50">
              <path
                d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h2v2h-2zM17 15h2v2h-2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm">Point your camera at the QR code on the bottle</p>
          </div>
        )}
        <div id={regionId.current} className={state === "idle" ? "hidden" : "w-full"} />
      </div>

      {state === "scanning" ? (
        <button
          onClick={stopScanner}
          className="inline-flex w-full items-center justify-center rounded-md border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Stop Scanner
        </button>
      ) : (
        <button
          onClick={startScanner}
          disabled={state === "starting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {state === "starting" ? "Starting camera…" : "Start Camera Scanner"}
        </button>
      )}

      {state === "error" && <p className="text-center text-xs text-destructive">{errorMessage}</p>}
      {state === "scanning" && (
        <p className="text-center text-xs text-muted-foreground">
          Align the QR code within the frame. Example QR data: "Honey Origin | Batch ID: HO-2026-001"
        </p>
      )}
    </div>
  );
}
