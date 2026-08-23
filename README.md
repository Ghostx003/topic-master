# 🌌 Topic Master — Complete React.js Study Management System (2026 Edition)

![Topic Master Banner](https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80)

**Topic Master** is a high-performance, local-first React.js study productivity application designed for managing complex academic curriculums, hierarchical topics, multi-dimensional tag matrices, study stopwatch sessions, and smart algorithmic schedule generation.

---

## ⚡ Key Highlights & 2026 Architecture

- ⚡ **Local-First Reactive Central Store**: Single source of truth powered by React Context + LocalStorage with instantaneous synchronization across all views.
- 🌳 **Arbitrary-Depth Topic Hierarchy**: Support for unlimited nested subtopics with promote, demote, reorder, move, and recursive progress aggregation.
- 🏷️ **10-Tag Status Matrix**: Dedicated tracking for `Done`, `Star`, `Require Practice`, `Confidence` (High/Medium/Low/None), `Redo`, `Lecture Needed`, `Deadline`, `Recall Activity`, `Practice DPP`, and `Skip`.
- ⏱️ **Persistent Background Study Timer**: Global stopwatch that persists across navigation and window refreshes with live audio feedback, manual time logging, and celebration confetti.
- 📅 **Intelligent Scheduler Wizard**: 3-step time allocator that balances study hours across subjects and filters high-priority topics with editable minutes and completion status tracking.
- 🛡️ **Isolated Admin Workspace**: Dedicated admin environment that completely isolates the main navigation bar, featuring a collapsible sidebar, master tag matrix, and quick workspace modals (`Hard`, `Doing`, `To Do`, `All Topics`).
- 📝 **Modular Content Block Workspace**: Notion-style rich topic canvas supporting text, markdown, hyperlinks with auto-URL detection, image attachments/file uploads, colored key notes, and book resources.
- 💾 **Safe JSON Backup & Restore**: Robust export/import service featuring full JSON schema validation, merge or overwrite restoration modes, and CS sample curriculum pre-loads.

---

## 🏗️ Project Architecture & File Tree

```text
e:\projects\TOPIC MASTER\
├── src/
│   ├── types/
│   │   ├── subject.ts           # Subject & Importance configurations
│   │   ├── topic.ts             # Topic, 10-tag matrix, sessions, confidence types
│   │   ├── contentBlock.ts      # Text, Link, Image, Note, Resource block definitions
│   │   ├── schedule.ts          # Generated schedule & wizard state types
│   │   └── store.ts             # Central application state & action interfaces
│   ├── services/
│   │   ├── storageService.ts    # Safe localStorage persistence engine
│   │   └── backupService.ts     # JSON schema validator, file exporter & importer
│   ├── utils/
│   │   ├── hierarchyUtils.ts    # Recursive tree builder, progress math, path resolver
│   │   ├── timeUtils.ts         # Stopwatch and duration formatting utilities
│   │   ├── urlDetector.ts       # Auto-link parsing regex engine
│   │   └── sampleData.ts        # Pre-loaded Computer Science curriculum dataset
│   ├── context/
│   │   ├── TopicMasterContext.tsx # Central synchronized state provider & reducer
│   │   └── ToastContext.tsx     # Glassmorphic toast notification system
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx       # Luxury button component
│   │   │   ├── Modal.tsx        # Accessible dialog backdrop with ESC/overlay close
│   │   │   ├── ConfirmationModal.tsx # Reusable confirmation dialogs
│   │   │   ├── SubjectImportancePill.tsx # Importance indicator with click-to-cycle
│   │   │   ├── TopicTagBadge.tsx # Interactive badges for the 10-tag matrix
│   │   │   ├── EmptyState.tsx   # Visual empty states with action triggers
│   │   │   └── ActiveTimerWidget.tsx # Floating persistent bottom-left active timer
│   │   ├── navbar/
│   │   │   └── MainNavbar.tsx   # 4-item top navbar with search & quick settings
│   │   ├── subjects/
│   │   │   ├── SubjectCard.tsx  # Card with bottom-right topic counts & progress
│   │   │   ├── SubjectStatsBar.tsx # Top KPI statistics overview
│   │   │   └── SubjectFilterSort.tsx # Search, importance filter & sorting toolbar
│   │   ├── topics/
│   │   │   ├── TopicTree.tsx    # Recursive subject tree manager
│   │   │   └── TopicTreeNode.tsx # Drag/promote/demote/reorder node component
│   │   ├── topicDetail/
│   │   │   ├── TopicDetailModal.tsx # Universal workspace modal
│   │   │   ├── SubtopicsList.tsx # Subtopic list with quick add & progress
│   │   │   ├── TopicTagsBar.tsx # 10-tag management toolbar
│   │   │   ├── StudyTimer.tsx   # Stopwatch timer with today/total session stats
│   │   │   ├── ContentBlockList.tsx # Modular block manager
│   │   │   └── ContentBlockEditor.tsx # Interactive block editor with link parser
│   │   ├── scheduler/
│   │   │   ├── SchedulerWizard.tsx # 3-step schedule generator
│   │   │   ├── TimeDistributionEditor.tsx # Visual subject time allocation sliders
│   │   │   └── GeneratedScheduleTable.tsx # Grouped study tasks with live tracking
│   │   └── admin/
│   │       ├── AdminNavbar.tsx  # Admin bar with Home button & modal triggers
│   │       ├── AdminSidebar.tsx # Collapsible subject navigator
│   │       └── AdminTopicMatrix.tsx # Master tag matrix with direct inline toggles
│   ├── modals/
│   │   ├── AddSubjectModal.tsx  # Create/edit subject with palette selector
│   │   ├── AddTopicModal.tsx    # Create topic/subtopic node
│   │   ├── HardTopicsModal.tsx  # Filtered challenging topics workspace
│   │   ├── DoingTopicsModal.tsx # In-progress topics workspace with quick timer
│   │   ├── TodoTopicsModal.tsx  # Roadmap topics modal
│   │   ├── AllTopicsModal.tsx   # Filterable master inventory table
│   │   ├── SettingsModal.tsx    # Backup export/import & database maintenance
│   │   └── GlobalSearchModal.tsx # Global command palette (Cmd+K / Ctrl+K)
│   ├── layouts/
│   │   ├── MainLayout.tsx       # Standard layout (MainNavbar + Toast + Active Timer)
│   │   └── AdminLayout.tsx      # Admin layout (Hides MainNavbar, shows AdminNavbar)
│   ├── pages/
│   │   ├── MySubjectsPage.tsx   # Dashboard with bottom-right floating button
│   │   ├── AddTopicsPage.tsx    # Subject switcher & hierarchy manager
│   │   ├── SchedulerPage.tsx    # Wizard & generated schedule view
│   │   ├── AdminPanelPage.tsx   # Master tag matrix table
│   │   └── NotFoundPage.tsx     # 404 fallback page
│   ├── App.tsx                  # Router configuration & provider hierarchy
│   ├── main.tsx                 # Entrypoint
│   └── index.css                # Custom scrollbars, glassmorphism & Tailwind styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd "TOPIC MASTER"
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be output to the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📊 Core Feature Matrix

### 1. Unified Central Source of Truth
All parts of the application share one unified reactive state store. Any action taken (such as checking a tag in the Admin Matrix, finishing a timer session in a Topic Workspace, or marking a task done in the Scheduler) updates the central store and immediately updates all other views.

### 2. 10-Tag Matrix System
Every topic supports fine-grained status metadata:
1. **Done**: Indicates completion (with strikethrough styling and progress bar calculation).
2. **Require Practice**: Flags topics needing problem-solving practice.
3. **Confidence**: Visual rating (`High` 🟢, `Medium` 🟡, `Low` 🟠, `None` ⚪).
4. **Skip**: Marks non-essential topics.
5. **Star**: Marks high-priority exam topics.
6. **Redo**: Flags topics requiring immediate re-study.
7. **Lecture Needed**: Tracks how many video lectures remain (with increment/decrement buttons).
8. **Deadline**: Assigns targeted completion calendar dates.
9. **Recall Activity**: Flags active recall / spaced repetition tasks.
10. **Practice DPP**: Flags daily practice problem sets.

### 3. Isolated Admin Workspace
Navigating to `/admin` activates the `AdminLayout` which:
- Completely hides the main application navbar.
- Shows the Admin top bar with a prominent **Home** button returning to `/subjects`.
- Features a collapsible sidebar listing all subjects with completion statistics.
- Provides direct top buttons for **Hard**, **Doing**, **To Do**, and **All Topics** modals.
- Features the master editable topic matrix table.

---

## 🔒 Security & Data Privacy

- **100% Local-First**: No remote servers or tracking telemetry. All subject notes, links, and study logs stay securely on your device.
- **Data Portability**: Full JSON backup exports and schema-validated merge/overwrite imports.

---

## 📄 License

This project is licensed under the terms of the [MIT License](LICENSE).
