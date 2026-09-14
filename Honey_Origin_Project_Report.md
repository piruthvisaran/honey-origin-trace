# Honey Origin — Honey Traceability and Batch Verification System
## Project Report

### Abstract
Honey Origin is a lightweight, browser-based honey traceability prototype designed for the Smart India Hackathon (SIH) concept "Honey Chain — Blockchain-Based Honey Traceability and Smart Beekeeping Management." The system addresses a critical gap in the Indian honey supply chain: consumers rarely know where their honey comes from, and small-scale beekeepers lack a simple way to register batch provenance. This prototype implements two tightly coupled modules — a customer-facing verification page and a beekeeper-facing batch creation page — that together demonstrate the first mile of farm-to-table traceability. All data is stored locally in the browser for demonstration purposes, making the application instantly runnable without any backend setup.

### Problem Statement
India is one of the world's largest honey producers, yet adulteration and mislabeling remain widespread. Consumers have no easy way to verify the source of honey they purchase, while beekeepers who follow ethical practices struggle to differentiate their products. Existing traceability solutions are often expensive, require complex enterprise software, or depend on technologies such as blockchain and IoT that are inaccessible to small farmers. There is a need for a simple, trustworthy, and low-cost entry point that connects beekeepers directly with consumers through batch-level verification.

### Objectives
The primary objective of Honey Origin is to prove that a minimal, customer-only traceability interface can be built and demonstrated without blockchain, IoT sensors, artificial intelligence, payment gateways, or user authentication. The specific goals are:

1. Allow a beekeeper or authorized user to create a honey batch record and automatically generate a unique Batch ID.
2. Generate a printable QR code for each batch so it can be attached to honey bottles.
3. Let any consumer scan the QR code or manually enter a Batch ID to view registered batch details.
4. Display only verified source information — beekeeper, farm, origin, contact, honey type, harvest date, quantity, packaging date, and expiry date.
5. Clearly communicate that the verification confirms registration only, not laboratory purity or quality certification.

### System Overview
Honey Origin is implemented as a single-page web application built with TanStack Start, React, TypeScript, and Tailwind CSS. The application runs entirely in the browser and uses the browser's localStorage API to persist batch records. This design choice makes the prototype fully portable and ideal for college demonstrations, hackathon pitches, and user testing without requiring server deployment or database configuration.

The application is divided into two routes:

- **Customer Verification (`/`)** — The public-facing page where consumers scan or type a Batch ID.
- **Batch Creation (`/create`)** — The producer-facing page where beekeepers register a new batch.

Both routes share a common design language and a single batch registry, so any batch created on the `/create` page is immediately verifiable on the `/` page.

### Customer Verification Module
The customer verification page is the main entry point of the application. It opens with a clean hero section titled "Know where your honey comes from" and a subheading that explains the purpose. The core interaction is a tabbed card with two options: "Scan QR" and "Enter Batch ID."

The Scan QR tab uses the `html5-qrcode` library to access the device camera, preferably the rear camera on mobile phones. When a QR code is scanned, the application extracts the Batch ID using a regular expression (`HO-YYYY-NNN`) and automatically performs the lookup. If camera access is denied or unavailable, the user is shown a friendly error message and can switch to manual entry.

The Enter Batch ID tab provides a simple text input with the placeholder `HO-2026-001` and a Verify button. Upon submission, the system searches the local batch registry. If the batch is found, a green "REGISTERED BATCH" card displays all source and batch details along with a disclaimer that the registration does not imply purity or laboratory quality. If the batch is not found, a red "BATCH NOT FOUND" card is shown.

### Batch Creation Module
The batch creation module is the producer-side entry point of the larger Honey Chain concept. It presents a clean form organized into two sections: Beekeeper Details and Honey Batch Details. Beekeeper Details include name, farm or apiary name, contact number, location, district, and state. Honey Batch Details include honey type, origin, harvest date, quantity, processing date, packaging date, and expiry date.

The honey type is selected from a dropdown containing Multifloral Honey, Wildflower Honey, Eucalyptus Honey, Acacia Honey, and Other. The Batch ID is generated automatically in the format `HO-2026-001`, `HO-2026-002`, and so on, ensuring uniqueness without manual input.

After successful validation and submission, the application stores the batch, then uses the `qrcode` library to generate a QR code containing the verification payload `Honey Origin | Batch ID: HO-2026-NNN`. The success screen displays a confirmation message, the generated Batch ID, a batch record summary, and the QR code. Users can download the QR code as a PNG image, print it directly from the browser, or create another batch.

### Technology Stack
- **Framework:** TanStack Start with React 19 and file-based routing.
- **Language:** TypeScript for type safety and maintainability.
- **Styling:** Tailwind CSS v4 with a custom oklch-based color theme.
- **QR Scanning:** `html5-qrcode` for camera-based QR code detection.
- **QR Generation:** `qrcode` for producing downloadable and printable QR images.
- **Validation:** Zod for robust form validation and user feedback.
- **Storage:** Browser localStorage for prototype data persistence.

### Design Approach
The visual design targets a professional agricultural technology product rather than a generic template. The color palette is built around warm honey gold, cream, white, and dark brown, with subtle green accents. Typography pairs Fraunces, an elegant serif, for headings with Inter Tight, a clean sans-serif, for body text. Cards are rounded but restrained, whitespace is generous, and there are no cartoon bees, excessive honey graphics, or unnecessary animations. The result is a premium, trustworthy interface suitable for an SIH presentation or a startup pitch.

### Data Flow and Integration
The end-to-end flow of the prototype mirrors the intended Honey Chain architecture:

1. **Beekeeper** enters production details on the Batch Creation page.
2. **System** generates a unique Batch ID and a QR code.
3. **QR code** is printed and placed on the honey bottle.
4. **Consumer** scans the QR code or enters the Batch ID on the Customer Verification page.
5. **System** returns the registered batch details or a not-found message.

This flow establishes the foundational data layer that can later be connected to blockchain for tamper-resistant records, IoT sensors for hive and environmental monitoring, and AI for disease detection and productivity prediction. These advanced features are intentionally excluded from the prototype to keep the scope focused and demonstrable.

### Demo Data
The application is seeded with two demonstration batches:

- **HO-2026-001:** Ravi Kumar, Green Bee Farm, Pollachi, Tamil Nadu, Multifloral Honey, 25 kg, harvested 20 August 2026, packaged 24 August 2026, expires 24 August 2028.
- **HO-2026-002:** Meena Beekeepers, Golden Hive Apiary, Coimbatore, Tamil Nadu, Wildflower Honey, 20 kg, harvested 28 August 2026, packaged 30 August 2026, expires 30 August 2028.

These records allow evaluators to test verification immediately without creating a batch first.

### Future Scope
While the current prototype is intentionally minimal, it is architected for extension. The localStorage-based registry can be replaced by a cloud database such as Lovable Cloud or Supabase. The Batch ID can be anchored to a blockchain ledger for immutable provenance. IoT sensors can feed hive temperature, humidity, and floral source data into the batch record. AI models can predict harvest windows or detect colony diseases. Each of these enhancements builds on the same batch registry and QR-code workflow demonstrated here.

### Conclusion
Honey Origin successfully demonstrates a practical, customer-focused honey traceability system without over-engineering. By separating the consumer verification experience from the producer batch creation workflow, the prototype proves that traceability can start with simple tools: a form, a QR code, and a lookup page. The warm, professional design and clear disclaimer about registration versus purity make the application credible and presentation-ready. It serves as an ideal foundation for the larger Honey Chain vision and can be extended into a full production traceability platform in future iterations.
