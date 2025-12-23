# Interactsh Web Client

<h4 align="center">A Next.js-based web interface for <a href="https://github.com/projectdiscovery/interactsh">Interactsh</a></h4>

## Getting Started

### Prerequisites

- Node.js 20+ (required for React 19)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/projectdiscovery/interactsh-web.git
cd interactsh-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Docker

Build and run using Docker:

```bash
docker build -t interactsh-web .
docker run -p 3000:3000 interactsh-web
```

## Environment Variables

Create a `.env.local` file in the root directory to customize the configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_HOST` | Default Interactsh server host | `oast.fun` |
| `NEXT_PUBLIC_TOKEN` | Authentication token (optional) | - |
| `NEXT_PUBLIC_CIDL` | Correlation ID Length | `20` |
| `NEXT_PUBLIC_CIDN` | Correlation ID Nonce Length | `13` |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **React**: React 19.1.0
- **Styling**: SCSS, Tailwind CSS, styled-components
- **Language**: TypeScript
- **UI Components**: Headless UI v2
- **Cryptography**: node-rsa, crypto-browserify
- **Theme Management**: next-themes

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   ├── styles.scss        # Page styles
│   ├── terms/             # Terms page
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
│   ├── appLoader/
│   ├── customHost/
│   ├── detailedRequest/
│   ├── header/
│   ├── icons/             # SVG icon components
│   ├── notificationsPopup/
│   ├── requestsTable/
│   ├── resetPopup/
│   ├── tabSwitcher/
│   └── toggleBtn/
├── lib/                   # Utility functions and types
│   ├── index.ts           # Core functionality
│   ├── localStorage/      # Local storage management
│   ├── notify/            # Notification services
│   ├── registry.tsx       # styled-components registry
│   └── types/             # TypeScript type definitions
├── helpers/               # Fallback loaders
├── styles/                # Global styles
└── theme.ts               # Theme configuration
```

## Features

- Real-time interaction monitoring
- Multiple protocol support (HTTP, DNS, SMTP)
- Tab management for multiple sessions
- Request/Response detailed view
- Notification integrations (Telegram, Slack, Discord)
- Custom host configuration
- Data export functionality
- Theme selection (Dark, Synth, Blue)

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Credits

- [ProjectDiscovery](https://projectdiscovery.io/) - Interactsh core
