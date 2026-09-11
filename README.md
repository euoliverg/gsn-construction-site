# GSN Contru

A modern marketing website for GSN Contru, built with React, TypeScript, Vite and Tailwind CSS.

## Overview

This project is a high-conversion landing page for a construction and remodeling business, focused on:

- Service presentation and trust-building
- Portfolio showcase
- Lead generation through quote requests
- Mobile-first experience
- Fast deployment on Vercel

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons

## Project Structure

```text
src/
├── components/
├── context/
├── lib/
├── App.tsx
├── index.css
├── main.tsx
public/
├── assets/
├── robots.txt
├── sitemap.xml
.github/
├── workflows/
├── ISSUE_TEMPLATE/
README.md
CONTRIBUTING.md
LICENSE
package.json
vite.config.ts
```

## Local Development

```bash
npm install
npm run dev
```

The app will be available in your browser at the URL shown by Vite.

## Production Build

```bash
npm run build
```

## Quality Check

```bash
npm run lint
```

## Live Chat & Admin Panel

The site includes a live chat widget for visitors and a mobile-friendly admin
panel at `/admin` for employees to reply, backed by Firebase (Firestore +
Auth).

### One-time Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build > Firestore Database** → Create database (production mode is fine).
3. **Build > Firestore Database > Rules** → paste the contents of
   [`firestore.rules`](firestore.rules) and publish.
4. **Build > Authentication > Sign-in method** → enable **Anonymous** (used
   for visitors) and **Email/Password** (used for employees).
5. **Build > Authentication > Users** → add one user per employee (email +
   password) who should be able to answer chats.
6. **Project settings > General > Your apps** → add a Web app, copy the
   config values.
7. Copy [`.env.example`](.env.example) to `.env.local` and fill in the values
   from step 6. Add the same variables in Vercel (Project Settings →
   Environment Variables) for production.

### Using it

- Visitors: the chat bubble (bottom-left) is on every public page. They enter
  their name once and can message the team in English; no account needed.
- Employees: go to `/admin`, sign in with the email/password created in step
  5, pick a conversation on the left, and reply in Portuguese — visitors see
  replies in real time.

**Auto-translation:** the chat auto-translates every message (free, no API
key) so visitors always write/read in English and employees always
write/read in Portuguese — each side never has to switch languages. The
admin panel also shows the client's original English text in small gray
text under each translated bubble, in case a name, address or detail needs
double-checking. This relies on a free public translation API with a modest
daily quota; if it's ever exceeded, messages fall back to showing the
original, untranslated text instead of breaking.

Until the environment variables are set, the chat widget hides itself and
`/admin` shows a "not configured" message instead of breaking the site.

## Deployment

This repository is configured for deployment on Vercel.

Production URL:
https://gsnconstruction-test.vercel.app

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and contribution standards.

## License

This project is licensed under the [MIT License](LICENSE).
