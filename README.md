# Personal Budget Tracker

A single-page React application for tracking personal income and expenses. It lets
you record transactions, view your current balance, filter your history, edit or
delete entries, and see a category-based spending summary. All data is saved in the
browser's `localStorage`, so it persists between visits without a backend.

---

## Tech Stack

| Tool | Purpose |
| --- | --- |
| **React 18** | UI component library |
| **React Router v6** | Client-side routing between pages |
| **Vite 5** | Dev server and production build tool |
| **localStorage** | Client-side data persistence (no backend) |
| **Vercel** | Deployment (SPA rewrites in `vercel.json`) |

---

## Getting Started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# create a production build
npm run build

# preview the production build locally
npm run preview
```

---

## How It Works

### 1. Application Bootstrap

The app is mounted and wired together at startup:

- **[index.html](index.html)** — Root HTML page with the `<div id="root">` mount point.
- **[src/main.jsx](src/main.jsx)** — Entry point. Renders `<App />` inside a chain of
  providers so every page/component can access shared state:
  - `BrowserRouter` → enables routing
  - `ThemeProvider` → provides light/dark theme
  - `TransactionsProvider` → provides transaction data + actions
- **[src/App.jsx](src/App.jsx)** — Defines the layout (`NavBar` + main content) and
  declares all routes.

### 2. Routing

Routes are declared in [src/App.jsx](src/App.jsx):

| Path | Page Component | Responsibility |
| --- | --- | --- |
| `/` | [Dashboard](src/pages/Dashboard.jsx) | Balance + filterable transaction list |
| `/add` | [AddTransaction](src/pages/AddTransaction.jsx) | Form to create a new transaction |
| `/transaction/:id` | [TransactionDetail](src/pages/TransactionDetail.jsx) | View / edit / delete a single transaction |
| `/summary` | [Summary](src/pages/Summary.jsx) | Totals + spending-by-category breakdown |
| `*` | [NotFound](src/pages/NotFound.jsx) | 404 fallback page |

Because it is a single-page app, [vercel.json](vercel.json) rewrites all requests to
`index.html` so client-side routes work on refresh/deep links.

### 3. State Management (React Context)

Global state is shared through two context providers instead of prop-drilling:

- **[src/context/TransactionsContext.jsx](src/context/TransactionsContext.jsx)** —
  The heart of the app. Holds the transactions array and exposes the actions
  `addTransaction`, `updateTransaction`, and `deleteTransaction`. It seeds sample
  data on first run and persists everything via the `useLocalStorage` hook. Any
  component can read/modify transactions through the `useTransactions()` hook.
- **[src/context/ThemeContext.jsx](src/context/ThemeContext.jsx)** — Holds the current
  theme (`light` / `dark`), exposes `toggleTheme`, and applies the theme by setting a
  `data-theme` attribute on `<html>`. Accessed via the `useTheme()` hook.

### 4. Persistence

- **[src/hooks/useLocalStorage.js](src/hooks/useLocalStorage.js)** — A reusable custom
  hook that syncs any React state value with `localStorage`. It reads the initial
  value from storage, writes updates back automatically, and listens for the `storage`
  event so multiple browser tabs stay in sync. Both context providers use this hook.

### 5. Shared Utilities

- **[src/utils/format.js](src/utils/format.js)** — Central place for shared constants
  and helpers: the `CATEGORIES` list, `CATEGORY_ICONS` map, the `categoryIcon()`
  lookup, and `formatCurrency()` for consistent USD formatting.

### 6. Reusable Components

- **[src/components/NavBar.jsx](src/components/NavBar.jsx)** — Top navigation bar with
  active-link highlighting (Dashboard / Add / Summary).
- **[src/components/TransactionItem.jsx](src/components/TransactionItem.jsx)** — A single
  transaction row shown in the Dashboard list. Wrapped in `React.memo` to avoid
  unnecessary re-renders when filters change.
- **[src/components/ThemeToggle.jsx](src/components/ThemeToggle.jsx)** — Button that
  switches between light and dark mode using the theme context.

### 7. Styling

- **[src/index.css](src/index.css)** — Global styles, including theming driven by the
  `data-theme` attribute set by the theme context.

---

## Responsibility Map (Who Does What)

| Concern | Responsible File(s) |
| --- | --- |
| App startup & provider wiring | [src/main.jsx](src/main.jsx) |
| Layout & route definitions | [src/App.jsx](src/App.jsx) |
| Navigation | [src/components/NavBar.jsx](src/components/NavBar.jsx) |
| Transaction data & CRUD actions | [src/context/TransactionsContext.jsx](src/context/TransactionsContext.jsx) |
| Theme state (light/dark) | [src/context/ThemeContext.jsx](src/context/ThemeContext.jsx) |
| Persistence to localStorage | [src/hooks/useLocalStorage.js](src/hooks/useLocalStorage.js) |
| Balance + list + filtering | [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) |
| Creating a transaction (form + validation) | [src/pages/AddTransaction.jsx](src/pages/AddTransaction.jsx) |
| Viewing/editing/deleting a transaction | [src/pages/TransactionDetail.jsx](src/pages/TransactionDetail.jsx) |
| Totals & spending-by-category | [src/pages/Summary.jsx](src/pages/Summary.jsx) |
| 404 handling | [src/pages/NotFound.jsx](src/pages/NotFound.jsx) |
| Single transaction row | [src/components/TransactionItem.jsx](src/components/TransactionItem.jsx) |
| Theme toggle button | [src/components/ThemeToggle.jsx](src/components/ThemeToggle.jsx) |
| Formatting & category helpers | [src/utils/format.js](src/utils/format.js) |
| Styling / theming CSS | [src/index.css](src/index.css) |
| SPA deploy config | [vercel.json](vercel.json) |

---

## Data Flow (Example: Adding a Transaction)

1. User fills out the form on **AddTransaction** and submits.
2. The form validates input (title, positive amount, category, date).
3. On success it calls `addTransaction()` from **TransactionsContext**.
4. The context prepends the new transaction and updates state.
5. **useLocalStorage** persists the updated array to `localStorage`.
6. The user is redirected to the **Dashboard**, which reads the same context and
   re-renders the list and recalculated balance.

```
AddTransaction ──addTransaction()──▶ TransactionsContext ──setValue()──▶ useLocalStorage ──▶ localStorage
                                            │
                                            ▼
                          Dashboard / Summary / TransactionDetail (read via useTransactions)
```

---

## Project Structure

```
index.html                  # HTML entry point
package.json                # Scripts & dependencies
vite.config.js              # Vite configuration
vercel.json                 # SPA rewrite rules for deployment
src/
  main.jsx                  # App bootstrap + provider wiring
  App.jsx                   # Layout + routes
  index.css                 # Global styles & theming
  components/
    NavBar.jsx              # Top navigation
    ThemeToggle.jsx         # Light/dark toggle button
    TransactionItem.jsx     # Single transaction row (memoized)
  context/
    ThemeContext.jsx        # Theme state provider
    TransactionsContext.jsx # Transactions state + CRUD provider
  hooks/
    useLocalStorage.js      # Reusable persistence hook
  pages/
    Dashboard.jsx           # Balance + filterable list
    AddTransaction.jsx      # Create form
    TransactionDetail.jsx   # View/edit/delete
    Summary.jsx             # Totals + category breakdown
    NotFound.jsx            # 404 page
  utils/
    format.js               # Categories, icons, currency formatting
```
