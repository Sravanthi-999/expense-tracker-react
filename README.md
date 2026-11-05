# SpendWise — Expense Tracker

A professional React + Vite expense tracker. Add, search, filter, inspect and delete expenses. Dashboard totals and category breakdowns update automatically.

## Features
- Validated expense form: title, positive amount, category, date and optional note
- Dashboard with total expenses, current-month expenses, transaction count and average
- Category spending breakdown
- Search and category filters
- Transaction detail view and delete action
- Browser `localStorage` persistence (data stays on this device/browser)

## Requirements
- Node.js 18.18+ (Node.js 20 LTS recommended)
- VS Code
- Git

## Run locally
1. Extract the ZIP.
2. Open the `expense-tracker-react` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL shown in the terminal, usually `http://localhost:5173`.

To test a production build:

```bash
npm run build
npm run preview
```

## Push to GitHub
Create a new empty repository on GitHub named `expense-tracker-react`. Do not add a README or .gitignore on GitHub because this project already includes a README.

In the VS Code terminal, from the project folder:

```bash
git init
git add .
git commit -m "Initial professional expense tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/expense-tracker-react.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If Git asks you to sign in, complete the browser sign-in prompt.

## Deploy on Vercel
1. Sign in at https://vercel.com using GitHub.
2. Select **Add New → Project**.
3. Import `expense-tracker-react`.
4. Framework preset: **Vite** (usually detected automatically).
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Click **Deploy**.

Every future push to the connected `main` branch will trigger a new deployment.

## Important notes
- This is a frontend-only project. Expenses are stored in the browser's localStorage, not in a shared cloud database.
- Data is specific to the browser and device. Clearing browser storage or using another device/browser will not carry the records over.
- The sample transactions are demo data for the first launch. You can delete them and add your own.
- Currency is currently set to INR in `src/App.jsx`. Change `currency: 'INR'` in the `money` formatter if needed.
