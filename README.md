# Mundi

🌍 **Mundi** — Globo 3D unificado de dados mundiais (PIB, saúde, educação, demografia, meio ambiente). Clean, moderno, em PT-BR.

## Stack
- Next.js 14 + TypeScript + Tailwind CSS
- CesiumJS + Resium (React wrapper)
- TanStack Query + Zustand
- Lucide React (ícones)

## Desenvolvimento
```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx         # Página principal com o globo
│   └── globals.css
├── components/
│   ├── Globe/           # Componentes do globo Cesium
│   ├── UI/              # Componentes de interface
│   └── DataPanel/       # Painel de dados do país
├── lib/
│   ├── api.ts           # Cliente de API (mock + real)
│   ├── store.ts         # Zustand store
│   └── utils.ts
├── hooks/               # Custom hooks
└── types/               # Tipos TypeScript
```

## Fontes de dados (planejadas)
- World Bank API
- WHO GHO
- UN Data
- Our World in Data
- FAO
- OECD

## Licença
MIT