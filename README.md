# Freelancer CRM Dashboard

A modern SaaS-style CRM built for freelancers to manage leads, sales pipeline, clients, and tasks — all in one place.

Designed with a focus on clean UI, smooth UX, and scalable component architecture.

---

## ✨ Features

### Core Features
* **📊 Dashboard** — at-a-glance business overview with KPIs, revenue charts, lead source breakdown, and activity feed
* **🧲 Leads Management** — comprehensive lead tracking with sortable, filterable table; status pipeline (New → Contacted → Proposal → Won/Lost)
* **🔄 Pipeline** — visual Kanban board for deal tracking across stages (drag-and-drop ready)
* **👥 Clients** — manage client profiles, contact info, company details, and associated revenue
* **✅ Tasks** — organize work, set priorities, track completion status

### Experience Features
* **🌙 Dark Mode** — seamless light/dark theme switching with next-themes
* **⚡ Modern UI/UX** — clean, professional design inspired by Linear, Notion, and Stripe
* **🎯 Responsive Design** — works beautifully on desktop, tablet, and mobile
* **♿ Accessible** — WCAG-compliant components built with Radix UI primitives
* **⚙️ Smart Tables** — sortable columns, search filtering, status badges, currency formatting

---

## 🛠 Tech Stack

### Core Framework
* **Next.js 16.2.4** (App Router, Turbopack) — fullstack React framework
* **React 19.2.4** — modern UI library
* **TypeScript 5** — type-safe development

### Styling & Design System
* **Tailwind CSS 3.4.19** — utility-first CSS framework
* **Radix UI** — unstyled, accessible component primitives
* **class-variance-authority** — component variants system
* **PostCSS + Autoprefixer** — CSS processing & browser compatibility

### UI Components & Interactions
* **Accordion** — collapsible content sections
* **Alert Dialog** — important user confirmations
* **Avatar** — user profile pictures
* **Checkbox, Radio, Toggle** — form inputs
* **Dialog, Popover, Dropdown Menu** — overlays & menus
* **Tooltip, Toast** — notifications & hints
* **Scroll Area** — custom scrolling
* **Select, Slider, Progress** — form controls & data visualization
* **Tabs, Collapsible** — content organization

### Data & Visualization
* **Recharts 2.15.4** — beautiful charts & graphs (revenue trends, lead sources)
* **date-fns 4.1.0** — date manipulation & formatting
* **react-day-picker 8.10.1** — calendar date picker

### Forms & State Management
* **react-hook-form 7.72.1** — lightweight form state
* **cmdk 1.1.1** — command palette & search
* **input-otp 1.4.2** — one-time password inputs

### Notifications & Feedback
* **sonner 2.0.7** — elegant toast notifications
* **Radix Toast** — accessible notifications

### User Experience
* **lucide-react 1.8.0** — beautiful SVG icons (200+ icons)
* **next-themes 0.4.6** — seamless dark/light mode switching
* **embla-carousel-react 8.6.0** — carousel/slider component
* **react-resizable-panels 2.1.9** — resizable layout panels
* **vaul 1.1.2** — drawer component
* **clsx + tailwind-merge** — smart className utilities

### Development Tools
* **ESLint 9** — code quality & consistency
* **tailwindcss-animate** — animation utilities

---

## 🧠 Architecture

### Project Structure
```
app/
├── (app)/              # Authenticated routes with shared layout
│   ├── dashboard/      # Revenue overview & activity feed
│   ├── leads/          # Lead management table
│   ├── pipeline/       # Kanban-style deal pipeline
│   ├── clients/        # Client directory & details
│   └── tasks/          # Task management board
└── page.tsx            # Public landing page (if needed)

components/
├── layout/             # Header, sidebar, page container
├── dashboard/          # Dashboard-specific components
├── leads/              # Leads table & modals
├── pipeline/           # Kanban board components
├── shared/             # Reusable badges, status indicators
└── ui/                 # Primitive UI components (Radix-based)

lib/
├── mock-data.ts        # Frontend mock data
├── types.ts            # TypeScript type definitions
└── utils.ts            # Utility functions
```

### Design System
* **Centralized styling** — CSS variables for colors, spacing, typography
* **Component-driven UI** — reusable, composable patterns
* **Accessibility first** — Radix UI primitives ensure WCAG compliance
* **Dark mode support** — seamless theme switching with next-themes
* **Responsive design** — mobile-first approach with Tailwind breakpoints

### Data Flow
* Mock data layer (`lib/mock-data.ts`) — no backend dependency
* Client-side state management — React hooks
* Type-safe — full TypeScript coverage

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ 
* npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd freelancer-crm

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** to view the app in your browser.

### Available Scripts
```bash
npm run dev      # Start Turbopack dev server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint checks
```

---

## 📸 Preview

### Dashboard
_KPI cards, revenue trend chart, lead source breakdown, recent leads table, activity feed_

### Leads Management
_Sortable, filterable leads table with real-time search and status pipeline tracking_

### Pipeline
_Kanban board with drag-and-drop stages (To Pitch → In Progress → Proposal → Negotiation → Won/Lost)_

### Clients
_Client directory with contact info, company details, and revenue tracking_

*Screenshots coming soon — check back for visual preview* 📸

---

## 💡 Key Highlights

### What This Project Demonstrates
* **Professional UI/UX Design** — polished, premium user experience
* **Modern React Architecture** — App Router, component composition, hooks
* **Design System Mastery** — Tailwind CSS, Radix UI, dark mode implementation
* **Real-World SaaS Patterns** — dashboards, data tables, kanban boards, filtering/sorting
* **Type-Safe Development** — full TypeScript coverage
* **Accessible Components** — WCAG-compliant UI built on Radix primitives
* **Responsive Design** — works seamlessly across all device sizes

### Why This Stack?
- **Next.js + React** — industry standard for modern SaaS
- **Radix UI** — unstyled, accessible primitives for complete design freedom
- **Tailwind CSS** — rapid development with utility-first approach
- **TypeScript** — catch bugs early, improve code quality
- **No Backend** — pure frontend project, easy to set up and explore

---

## 🔗 Future Enhancements

### Phase 1: Backend Integration
- [ ] API endpoints (Node.js/Express, Django, or Rails)
- [ ] Database (PostgreSQL, MongoDB)
- [ ] Real lead/client data persistence

### Phase 2: Authentication & Authorization
- [ ] User authentication (OAuth, JWT, or session-based)
- [ ] Role-based access control (Admin, Manager, User)
- [ ] Team/workspace management

### Phase 3: Advanced Features
- [ ] Real-time updates (WebSockets)
- [ ] Email integration (notifications, automated outreach)
- [ ] Advanced analytics & reporting
- [ ] AI-powered lead scoring
- [ ] Calendar & meeting scheduling

### Phase 4: Polish & Scale
- [ ] Analytics dashboard (Google Analytics, Mixpanel)
- [ ] Performance optimization
- [ ] Internationalization (i18n)
- [ ] Mobile app (React Native)

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Guide](https://react.dev)
- [Radix UI Components](https://www.radix-ui.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 👤 Author

**Robert Bunescu** — Frontend Developer & Designer

---

## 📄 License

This project is open source and available under the MIT License.
