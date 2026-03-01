# DEBLOAT_AI

> **The first AI-powered Android debloater. Connect via USB. Chat with Perplexity. Nuke bloatware with plain English.**

A landing page for Debloat AI — a desktop application (Windows/Mac/Linux) that connects to Android devices via ADB, allowing users to remove phone bloatware by chatting with an AI powered by Perplexity.

---

## Features

- **Boot Sequence Pre-loader** — Terminal-style animation simulating ADB daemon initialization
- **Custom HUD Cursor** — Crosshair design that transforms on interactive elements
- **Chat Terminal Demo** — Animated conversation showcasing natural language debloating
- **Kinetic Marquee Ticker** — Infinite scroll displaying example OpenClaw commands
- **Action Mode Toggle** — Interactive switch between Advisory and Lethal modes
- **OS-Specific Downloads** — Platform buttons for Windows (.exe), Linux (.AppImage), Mac (.dmg)
- **Responsive Design** — Mobile-first with collapsible navigation
- **Documentation Page** — Quick start guide, command reference, architecture overview

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12.34.3 |
| Icons | Lucide React v0.575.0 |
| 3D (optional) | Three.js, React Three Fiber |

---

## Design System

**RAW CYBER-BRUTALISM** — Zero glassmorphism, zero soft shadows, zero blur effects.

| Element | Value |
|---------|-------|
| Background | `#030303` |
| Primary Red | `#D33C34` |
| Accent Teal | `#71A1A1` |
| Warning Orange | `#f97316` |
| Borders | 1px solid `#1a1a1a` |
| Typography | Spline Sans Mono |
| Animation | 0.2s duration, `circOut` easing |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Arjun-Walia/debloat-landing.git
cd debloat-landing

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
debloat-landing/
├── public/
│   └── desktop.png          # App interface screenshot
├── src/
│   ├── app/
│   │   ├── globals.css      # Design system, animations, utilities
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Main landing page
│   │   └── docs/
│   │       └── page.tsx     # Documentation page
│   └── components/
│       ├── CryptoReveal/    # Text scramble animation
│       ├── PixelTransition/ # Pixel dissolve effect
│       └── TextType/        # Typewriter effect
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Page Components

| Component | Description |
|-----------|-------------|
| `BootSequence` | Full-screen terminal boot animation |
| `HUDCursor` | Custom crosshair cursor with hover states |
| `MarqueeTicker` | Infinite scrolling command examples |
| `ChatTerminal` | Animated AI conversation demo |
| `ActionModeToggle` | CSS toggle switch for mode selection |
| `DataStream` | Hexadecimal data visualization |

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Arjun-Walia/debloat-landing)

### Static Export

```bash
npm run build
# Output in .next/ directory
```

---

## Environment Variables

No environment variables required for the landing page. The actual Debloat AI application requires a Perplexity API key.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

MIT

---

## Links

- [Debloat AI App](https://github.com/abhishek112007/debloat-ai) — Main application repository
- [Documentation](https://debloat.ai/docs) — Usage guides and API reference
