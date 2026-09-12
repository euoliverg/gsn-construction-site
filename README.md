# GSN Construction · OLIVER.DEV

![CI](https://github.com/euoliverg/gsn-construction-site/actions/workflows/ci.yml/badge.svg)
[![Live site](https://img.shields.io/badge/live%20site-visit-167c80?style=flat)](https://gsnconstruction-test.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-167c80?style=flat)](LICENSE)

> A polished, mobile-first website and real-time customer chat platform for a
> construction and remodeling business.

**Built and presented by [OLIVER.DEV](https://github.com/euoliverg)**

**[Visit the live site](https://gsnconstruction-test.vercel.app)** · **[View the admin panel docs](admin-panel/README.md)**

## What this project includes

- Service pages designed to turn visits into quote requests
- Project gallery, before-and-after transformations, and video showcase
- Responsive experience for homeowners browsing on mobile or desktop
- Real-time chat between visitors and the GSN Construction team
- Portuguese/English message translation for customers and employees
- Separate Firebase-powered admin panel for managing conversations
- Automated CI checks and Vercel-ready production deployment

## Product structure

```text
GSN CONTRU/
├── src/                 # Public website and shared visitor experience
│   ├── components/      # Header, hero, services, gallery, chat and CTAs
│   ├── context/         # Chat and service-selection state
│   ├── lib/             # Firebase, translations, projects and videos
│   └── pages/           # Home, services, projects, contact and service area
├── public/              # SEO files, project images and videos
├── admin-panel/         # Standalone employee chat dashboard
├── firestore.rules      # Shared Firebase security rules
├── .github/             # CI, issue templates and pull request workflow
└── vercel.json          # Deployment configuration
```

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, React Router |
| Build | Vite, Tailwind CSS |
| UI | Lucide React, responsive CSS |
| Backend | Firebase Authentication and Firestore |
| Translation | Public translation API with graceful fallback |
| Delivery | Vercel and GitHub Actions |

## Run locally

### Public website

```bash
npm install
npm run dev
```

### Admin panel

The admin panel is a separate Vite app and must use the same Firebase project as
the public website.

```bash
cd admin-panel
npm install
npm run dev
```

Copy [`.env.example`](.env.example) to `.env.local` in each app that needs
Firebase and fill in the project values. Environment files stay local and are
ignored by Git.

## Verification

Run the same checks used by CI before opening a pull request:

```bash
npm run lint
npm run build
```

To validate the admin panel too:

```bash
cd admin-panel
npm run lint
npm run build
```

## Firebase and chat setup

1. Create a Firebase project with Firestore and Authentication enabled.
2. Enable Anonymous sign-in for visitors and Email/Password sign-in for staff.
3. Publish the rules from [`firestore.rules`](firestore.rules).
4. Create staff accounts in Firebase Authentication.
5. Add the Firebase environment variables to local development and Vercel.

Visitors can start a conversation without an account. Staff members sign in at
`/admin`, select a conversation, and reply in Portuguese. The chat translates
messages automatically and falls back to the original text if the translation
service is unavailable.

## Deployment

The public site is configured for Vercel. The admin panel can be deployed as a
separate Vercel project or under its own subdomain. Configure the Firebase
environment variables in the hosting provider before deploying.

**Production:** [gsnconstruction-test.vercel.app](https://gsnconstruction-test.vercel.app)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and pull
request standards.

## License

This project is released under the [MIT License](LICENSE).

---

### OLIVER.DEV

Digital products, modern websites and practical technology solutions.
