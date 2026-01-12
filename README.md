# Brilliance Advisory Website

A modern, responsive Next.js website that replicates the layout and design of sg.lendela.com, a loan comparison platform.

## Features

- **Homepage** with hero section, features, how it works, testimonials, and partners
- **Loan Comparison** with advanced filters and search
- **Side-by-side Loan Comparison Tool** for comparing multiple loans
- **Interactive Loan Calculator** with real-time calculations and charts
- **Loan Application Form** with validation
- **Blog/Resources Section** with categories and search
- **About and FAQ Pages**
- **Responsive Design** for all devices

## Technology Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod (validation)
- Recharts (charts)
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
CRM/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── sections/           # Homepage sections
│   ├── calculator/         # Loan calculator
│   ├── comparison/         # Loan comparison tool
│   └── forms/              # Form components
├── lib/                    # Utility functions and data
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Build

```bash
npm run build
```

## License

MIT
