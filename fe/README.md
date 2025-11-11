# LITE - E-commerce Application

React + Vite e-commerce application with TypeScript.

## 📁 Project Structure

```
code-2/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── ui/            # UI components (shadcn/ui)
│   │   └── ...            # Feature components
│   ├── contexts/          # React Context providers
│   │   ├── auth-context.tsx
│   │   ├── cart-context.tsx
│   │   ├── buy-now-context.tsx
│   │   └── shipping-context.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components (routes)
│   │   ├── Home.tsx
│   │   ├── Product.tsx
│   │   ├── Cart.tsx
│   │   └── ...
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── backend/               # Java backend (Spring Boot)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📦 Features

- Product browsing and search
- Shopping cart
- User authentication
- Buy now flow
- Checkout process
- Brand and category filtering

