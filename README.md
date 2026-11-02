# Kanban Task Management

> A responsive task-management workspace for organizing projects, tracking progress, and keeping everyday work moving.

## 📸 Preview
![preview](/public/desktop%20(1).jpeg)

**Kanban Task Management** is a browser-based Kanban application built with React and TypeScript. Create boards around your projects, shape them into custom workflow columns, and organize tasks with subtasks, status updates, and drag-and-drop ordering. A clean interface, responsive layouts, and light and dark themes make the workspace comfortable on desktop and mobile.

> **Storage note:** This project currently saves boards and theme preferences in the visitor's browser using `localStorage`. It does not include a cloud service, user accounts, or cross-device synchronization.

## Highlights

- **Workspaces that fit the project:** Create, rename, and remove boards, then add or edit workflow columns.
- **Actionable task details:** Create, edit, and delete tasks; add subtasks; track completed items; and change a task's column from its details.
- **Drag-and-drop workflow:** Move tasks between columns and reorder them within a column. Updates appear optimistically, with the previous order restored if saving fails.
- **Persistent browser storage:** Keep boards between visits without configuring a server or database.
- **Responsive navigation:** Use the board sidebar on larger screens or the compact board menu on mobile.
- **Light and dark themes:** Switch themes manually; the application also honors the system preference when no saved preference exists.
- **Validated forms:** React Hook Form and Zod provide structured form handling and input validation.
- **Reusable interface components:** Shared buttons, form fields, menus, and dialogs keep common interactions consistent.

## Technology

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript |
| Build and development | Vite 8 |
| Styling | Tailwind CSS 4 and a centralized CSS theme |
| Drag and drop | dnd-kit |
| Client-side data and cache | TanStack Query |
| Forms and validation | React Hook Form, Zod, and `@hookform/resolvers` |
| Linting | Oxlint |

## Getting started

### Requirements

- Node.js `20.19+` or `22.12+`
- npm

### Install and run locally

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Check and build

```bash
npm run lint
npm run build
npm run preview
```

The production build is written to `dist/`. `npm run preview` serves that build locally so it can be checked before deployment.

## Project structure

```text
.
├── public/                         # Logos, icons, and the browser favicon
├── src/
│   ├── components/                 # Shared buttons, fields, and modal
│   ├── context/                    # Light/dark theme provider and hook
│   ├── data/                       # Initial example boards and tasks
│   ├── features/
│   │   ├── KanbanDashboard.tsx     # Dashboard composition and active-board state
│   │   └── kanban/
│   │       ├── components/         # Board workspace, columns, cards, and menus
│   │       ├── layout/             # Header, desktop sidebar, and mobile menu
│   │       ├── modals/             # Board, task, and delete dialogs
│   │       ├── utils/              # Immutable optimistic cache updates
│   │       └── schemas.ts          # Board and task validation schemas
│   ├── hooks/                      # Board queries and mutation workflows
│   ├── services/                   # Board operations backed by localStorage
│   ├── types/                      # Board, column, task, and subtask types
│   ├── App.tsx                     # Application entry component
│   ├── index.css                   # Tailwind setup, design tokens, and base styles
│   └── main.tsx                    # React, theme, and query-client initialization
├── index.html                      # Document shell and initial loading screen
├── package.json                    # Dependencies and project commands
└── vite.config.ts                  # Vite configuration
```

### Where to start reading

- **Application setup:** `src/main.tsx` configures React, TanStack Query, and the theme provider.
- **Dashboard composition:** `src/features/KanbanDashboard.tsx` connects board selection, navigation, workspace, and dialogs.
- **Board interactions:** `src/features/kanban/components/BoardWorkspace.tsx` and `ColumnView.tsx` implement drag-and-drop, task ordering, and column rendering.
- **Data operations:** `src/hooks/useKanban.ts` connects queries and mutations to `src/services/kanbanService.ts`.
- **Visual system:** `src/index.css` defines the shared palette and theme-aware base styles; components use those tokens through Tailwind utilities.
- **Form rules:** `src/features/kanban/schemas.ts` defines validation for board and task forms.

## Browser data

- Board data is stored under `kanban_boards_data`.
- The selected theme is stored under `kanban-theme`.
- The initial example data in `src/data/mockData.ts` is used when no board data has been saved yet.
- Clearing site data in the browser removes the locally saved boards and theme preference.

Because data is local to the browser, it is not automatically shared with another browser, device, or user.

## Deployment

This is a Vite single-page application and can be deployed to a static hosting provider:

1. Run `npm ci`.
2. Run `npm run build`.
3. Publish the generated `dist/` directory.
4. Configure the host to serve `index.html` for application routes if it does not do so by default.

No backend environment variables are required for the current local-storage implementation.

