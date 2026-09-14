# Honey Source Verify

Use this prompt in Canva AI / Lovable / Bolt / v0 / another AI website builder:

Create a professional, modern customer-only web application called "Honey Origin".

PROJECT PURPOSE:
Honey Origin is a honey traceability system. The customer should ONLY be able to verify a honey product. Do NOT include beekeeper registration, admin dashboard, batch creation, sensors, IoT, AI, blockchain, payment, or seller features.

CUSTOMER FLOW:
1. Customer opens Honey Origin.
2. Customer sees two verification options:
   - Scan QR Code
   - Enter Batch ID
3. Customer scans the QR code printed on the honey bottle.
4. The QR contains a Honey Origin Batch ID.
5. The system searches the registered batch database.
6. If the batch exists, display "✓ REGISTERED BATCH".
7. If it does not exist, display "✕ BATCH NOT FOUND".
8. Show only beekeeper/source details and honey batch details.

HOME / VERIFICATION PAGE:
Header:
- Logo: Honey Origin
- Small navigation item: "Customer Verification"

Hero section:
- Small label: "CONSUMER VERIFICATION"
- Main heading: "Know where your honey comes from."
- Description:
  "Scan the QR code on your honey bottle or enter the Batch ID to view registered beekeeper and honey batch information."

Main verification card:
Create two tabs:
1. "Scan QR"
2. "Enter Batch ID"

SCAN QR:
- Use the device camera.
- Add a large QR scanner area.
- Button: "Start Camera Scanner"
- Request camera permission.
- When a QR is successfully scanned, extract the Batch ID.
- Automatically verify the batch.
- Example QR data:
  "Honey Origin | Batch ID: HO-2026-001"

MANUAL VERIFICATION:
- Label: "Honey Batch ID"
- Input placeholder: "HO-2026-001"
- Button: "Verify"
- Add small text: "Example: HO-2026-001"

VERIFIED RESULT:
When a valid Batch ID is found, show a clean verification card:

✓ REGISTERED BATCH

HO-2026-001

Beekeeper:
Ravi Kumar

Farm / Apiary:
Green Bee Farm

Origin:
Pollachi, Tamil Nadu

Location:
Pollachi, Tamil Nadu

Contact:
+91 98765 43210

Honey Type:
Multifloral Honey

Harvest Date:
20 August 2026

Quantity:
25 kg

Packaging Date:
24 August 2026

Expiry Date:
24 August 2028

Add a small information message:
"The batch information is registered in the Honey Origin system."

INVALID RESULT:
If the Batch ID does not exist, show:

✕ BATCH NOT FOUND

"This Batch ID is not registered in Honey Origin."

DESIGN:
- Professional real-world startup website appearance.
- Clean and minimal.
- Premium honey / agriculture / traceability feeling.
- Use warm honey-gold, cream, white and dark brown colors.
- Rounded cards but NOT excessive.
- Use elegant typography.
- Lots of whitespace.
- Responsive for both mobile and desktop.
- Do not make it look AI-generated.
- Do not use cartoon bees or excessive honey graphics.
- Do not use unnecessary animations.
- No stock photos are required.
- Make the QR scanner the main functionality.

TECHNICAL REQUIREMENTS:
- HTML, CSS and JavaScript.
- Make it fully functional.
- Use html5-qrcode or another reliable QR scanning library.
- QR scanning must work using the phone camera.
- Store the demo batch data in JavaScript/localStorage for the prototype.
- Do not require a login.
- Do not require customer registration.
- Do not create an admin page.
- Do not create a seller/beekeeper dashboard.

DEMO DATA:
Batch ID: HO-2026-001
Beekeeper: Ravi Kumar
Farm: Green Bee Farm
Location: Pollachi, Tamil Nadu
Contact: +91 98765 43210
Honey Type: Multifloral Honey
Origin: Pollachi, Tamil Nadu
Harvest Date: 20 August 2026
Quantity: 25 kg
Packaging Date: 24 August 2026
Expiry Date: 24 August 2028

SECOND DEMO:
Batch ID: HO-2026-002
Beekeeper: Meena Beekeepers
Farm: Golden Hive Apiary
Location: Coimbatore, Tamil Nadu
Contact: +91 98765 12345
Honey Type: Wildflower Honey
Origin: Coimbatore, Tamil Nadu
Harvest Date: 28 August 2026
Quantity: 20 kg
Packaging Date: 30 August 2026
Expiry Date: 30 August 2028

IMPORTANT:
The application must NOT claim that the QR code proves honey purity or laboratory quality. It only verifies that the Batch ID and associated source information are registered in the Honey Origin system.

Create the complete working website, including all HTML/CSS/JavaScript code and the QR scanning functionality.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://honey-origin-trace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/efd79ae9-0609-42da-bec1-c934edbf7c93).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
