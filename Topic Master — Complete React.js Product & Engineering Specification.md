# Topic Master — Complete React.js Application Specification

Build a production-quality React.js application called **Topic Master**.

This is a study-management application for managing:

- Subjects
- Hierarchical topics and subtopics
- Topic statuses/tags
- Study progress
- Study hours
- Topic notes/resources
- Schedules
- Hard/Doing/To-Do workflows
- Topic-level study tracking
- Backup/import
- Administrative management

The application should feel like a **premium 2026 productivity application** rather than a basic CRUD project.

Use **React.js + Tailwind CSS** and modern UI/UX patterns throughout.

The final result should be polished, responsive, fast, accessible, maintainable, and highly interactive.

---

# 1. TECHNOLOGY REQUIREMENTS

Use:

- React.js
- Vite
- Tailwind CSS
- React Router
- Modern JavaScript/TypeScript
- Lucide React or another clean icon library
- A clean state-management solution appropriate for the application
- Local persistence so data survives page refreshes
- IndexedDB/localStorage where appropriate
- Modular reusable components
- Responsive design

Do not create one gigantic component.

Use a clean structure such as:

```text
src/
  components/
  pages/
  layouts/
  modals/
  hooks/
  context/
  store/
  services/
  utils/
  data/
  types/
  assets/
```

Keep business logic separate from presentation wherever practical.

---

# 2. CORE DATA MODEL

The application revolves around four primary entities:

```text
Subject
Topic
Subtopic
Schedule
```

A subject can contain unlimited main topics.

A topic can contain unlimited child topics.

Therefore the topic structure must support arbitrary nesting:

```text
Subject
 ├── Topic
 │    ├── Subtopic
 │    │    ├── Sub-subtopic
 │    │    └── Sub-subtopic
 │    └── Subtopic
 ├── Topic
 └── Topic
```

Do NOT hard-code the application to only two levels.

Use a recursive hierarchical data model.

---

# 3. IMPORTANT VARIABLE NAMING

Use descriptive variable names.

Prefer names like:

```text
Subject_Name
Subject_Importance
Topic_Name
Topic_Tags
Topic_Status
Topic_Deadline
Topic_Study_Hours
Topic_Confidence
Topic_Lecture_Needed
Topic_Description
Topic_Resources
Topic_Notes
Topic_Children
Subject_Topics
Schedule_Hours
Schedule_Subjects
Schedule_Topics
```

Do not use meaningless names such as:

```text
x
temp
foo
data1
thing
abc
```

Use clear names throughout the codebase.

---

# 4. MAIN APPLICATION NAVBAR

Outside the Admin Panel, the primary navbar contains exactly:

1. **My Subjects**
2. **Add Topics**
3. **Scheduler**
4. **Admin Panel**

The navbar should be modern, elegant, responsive, and clearly indicate the current section.

---

# 5. MY SUBJECTS

The My Subjects page is the primary dashboard.

Display subjects as attractive cards.

Each card should contain:

- Subject name
- Subject importance
- Total topics
- Completed topics
- Progress
- Study hours
- Other useful summary information

The topic count should appear toward the **bottom-right of the card**.

The subject importance should be visible directly on the card.

Example:

```text
┌──────────────────────────────┐
│ Operating Systems            │
│                              │
│ Urgent                       │
│                              │
│ Progress      42%            │
│                              │
│                     28 Topics│
└──────────────────────────────┘
```

Clicking a subject opens its detailed subject view.

---

# 6. SUBJECT IMPORTANCE

Create a reusable importance selector.

Variable:

```text
Subject_Importance
```

Default:

```text
Normal
```

Clicking the selector should cycle through states such as:

```text
Normal
Urgent
Important
Low Importance
High Scoring
Low Scoring
```

The pill/oval UI should change visually according to the selected state.

Do not merely change text.

Use subtle animations and visual hierarchy.

---

# 7. ADD SUBJECT

On the My Subjects page, place a floating **+ button** in the bottom-right.

Clicking it opens an Add Subject modal.

Allow the user to enter:

- Subject name
- Subject importance
- Description
- Optional metadata

After saving, the new subject must immediately appear everywhere relevant.

The same subject must become available in:

- My Subjects
- Add Topics
- Scheduler
- Admin Panel

There must be one centralized source of truth.

---

# 8. ADD TOPICS

The Add Topics page initially displays all subjects.

Click a subject.

Display its hierarchical topic tree.

The user must be able to:

- Add main topic
- Add subtopic
- Add nested subtopic
- Rename topic
- Delete topic
- Delete subtopic
- Move topic
- Move subtopic
- Reorder topics
- Promote a subtopic to a main topic
- Demote a main topic into a subtopic
- Drag and drop hierarchy where practical

Example:

```text
Operating Systems

▼ CPU Scheduling
    ├── FCFS
    ├── SJF
    ├── SRTF
    ├── Round Robin
    └── Priority Scheduling

▼ Process Management
    ├── Process States
    ├── PCB
    └── Context Switching

▼ Memory Management
```

The tree must support arbitrary depth.

Make hierarchy management extremely easy.

---

# 9. TOPIC TAG SYSTEM

The application has a centralized variable/category called:

```text
Topic_Tags
```

These tags/statuses must be available across the application.

Include:

- Done
- Require Practice
- Confidence
- Skip
- Star
- Redo
- Lecture Needed
- Deadline
- Recall Activity
- Practice DPP

The system should be extensible so additional tags can be added later.

---

# 10. TOPIC TAG UI

When topics are displayed in tables/lists, the Topic Tags should appear as columns.

Example:

| Topic | Done | Practice | Confidence | Skip | Star | Redo | Lecture Needed | Deadline |
|---|---|---|---|---|---|---|---|---|
| CPU Scheduling | ✓ | ✓ | High | | ★ | | 2 | 28 Aug |

Most tags use checkboxes/toggles.

## Star

Star is special.

Use an actual star icon instead of a checkbox.

Clicking it toggles:

```text
Not Starred
Starred
```

## Deadline

Deadline should allow selecting:

- Date
- Optional time

The deadline should be stored with the topic.

## Lecture Needed

Allow an integer.

Example:

```text
Lecture Needed: 3
```

The user can increase/decrease the number.

---

# 11. TOPIC DETAIL MODAL

This is one of the most important parts of the application.

Whenever the user clicks a topic, open a **dedicated Topic Detail Modal**.

Do NOT navigate the user away to a giant page unnecessarily.

The modal should feel like a premium workspace.

At the top:

```text
CPU Scheduling
```

If the selected item is a parent topic, show:

```text
CPU Scheduling

Subtopics:
  FCFS
  SJF
  SRTF
  Round Robin
  Priority Scheduling
```

If the user clicks a subtopic, show only that selected subtopic as the primary title.

---

# 12. TOPIC WORKSPACE

Inside the Topic Detail Modal, allow the user to create unlimited content blocks.

For example:

```text
CPU Scheduling

[ Text Block ]

[ Link Block ]

[ Image Block ]

[ Notes Block ]

[ Resource Block ]

[ Study Session Block ]
```

The user should be able to add as many blocks as needed.

Supported content should include:

- Text
- Links
- Images/photos
- Notes
- URLs
- Descriptions
- Study information

Automatically recognize URLs when pasted.

Links should be clickable.

Images should display cleanly.

---

# 13. STUDY TIMER / TIME TRACKING

Inside the topic modal provide a study-time mechanism.

When the user clicks the time tracking control:

- Capture the current time
- Start a study session
- Allow stopping/ending the session
- Calculate elapsed time
- Save the study session

Display:

```text
Today's Study Time
Total Study Time
Number of Sessions
Last Studied
```

If the user studies:

```text
COA → 1 hour
```

then the total study time for that topic must update globally.

The subject's total study time must also update.

The scheduler must also reflect it.

Everything must use the same underlying data.

---

# 14. GLOBAL SYNCHRONIZATION

This is critical.

If a topic is changed anywhere in the application, the change must immediately propagate throughout the entire application.

For example:

If:

```text
CPU Scheduling → Done
```

is checked inside the Scheduler,

then that same topic must immediately show Done in:

- Add Topics
- Admin Panel
- Subject Details
- Scheduler
- Topic Detail Modal
- All Topics

Likewise:

```text
Study Time = +1 hour
```

must update:

- Topic study time
- Subject study time
- Schedule statistics
- Dashboard statistics

Do not duplicate independent copies of topic data.

Use a centralized state/data layer.

---

# 15. SCHEDULER

Clicking Scheduler opens the Scheduler configuration interface.

Ask:

### Step 1 — Study Time

```text
How many hours do you want to study?
```

Example:

```text
4 hours
```

### Step 2 — Subjects

Allow the user to select subjects.

Example:

```text
☑ Operating Systems
☑ Computer Networks
☑ COA
☐ DBMS
```

### Step 3 — Topic Filtering

For each selected subject, allow the user to filter topics using:

```text
Topic_Tags
```

For example:

```text
☑ Require Practice
☑ Redo
☑ Lecture Needed
☑ Deadline
☑ Star
```

The scheduler should retrieve topics matching the selected filters.

---

# 16. SCHEDULER TIME DISTRIBUTION

Suppose:

```text
Total Study Time = 4 hours

Selected Subjects:
OS
COA
CN
DBMS
```

The scheduler should distribute the available time intelligently.

Allow the user to adjust allocation manually if desired.

For example:

```text
OS       1h
COA      1h
CN       1h
DBMS     1h
```

The system should prevent impossible allocations.

Show total allocation clearly.

---

# 17. GENERATED SCHEDULE

After generation, display the schedule in a structured table/workspace.

For example:

```text
┌─────────────────────────────────────────────┐
│                 OPERATING SYSTEMS            │
├─────────────────────────────────────────────┤
│ Topic              │ Tags │ Time │ Status   │
├─────────────────────────────────────────────┤
│ CPU Scheduling     │ ...  │ 30m  │ ...      │
│ Process Management │ ...  │ 20m  │ ...      │
│ Memory Management  │ ...  │ 10m  │ ...      │
└─────────────────────────────────────────────┘
```

The subject name should be prominently displayed.

Topics selected by the scheduler should appear beneath the relevant subject.

Topic tags should appear as columns.

Clicking any topic opens the same Topic Detail Modal used everywhere else.

---

# 18. SCHEDULE CONTROLS

The generated schedule should provide:

- Delete Schedule
- Reset Schedule
- Edit Schedule
- Regenerate Schedule

Resetting/deleting must require confirmation.

Example confirmation:

> Are you sure you want to delete this schedule?

Provide:

```text
Cancel
Delete Schedule
```

Do not accidentally destroy data without confirmation.

---

# 19. ADMIN PANEL ARCHITECTURE

The Admin Panel is a **separate application workspace inside Topic Master**.

When entering Admin Panel:

### Hide the original main navbar.

Do NOT show:

```text
My Subjects
Add Topics
Scheduler
Admin Panel
```

Instead, Admin Panel gets its own navigation system.

There should only be a clear **Home** button that takes the user back to the main Topic Master application.

---

# 20. ADMIN PANEL SIDEBAR

The Admin Panel contains a collapsible subject sidebar.

Example:

```text
☰

SUBJECTS

Operating Systems
Computer Networks
COA
DBMS
Algorithms
```

The sidebar:

- Is visible by default
- Can be collapsed
- Has a hamburger button
- When collapsed, content expands to use the freed space
- Can be reopened with the hamburger button

The transition should be smooth.

---

# 21. ADMIN PANEL NAVBAR

Admin Panel has its own navbar:

```text
Hard
Doing
To Do
All Topics
```

These are not normal page routes that cram everything into one giant screen.

Each option should open its **own dedicated modal/workspace**.

The underlying Admin Panel should remain clean.

---

# 22. HARD MODAL

Click:

```text
Hard
```

Open a dedicated Hard Topics modal/workspace.

If the user selected:

```text
Operating Systems
```

from the sidebar,

show only hard topics belonging to Operating Systems.

For example:

```text
Operating Systems

Hard Topics

┌───────────────────────────────┐
│ CPU Scheduling                │
│ Needs Attention              │
│ ★ Important                  │
└───────────────────────────────┘

┌───────────────────────────────┐
│ Deadlock Detection            │
│ Hard                          │
└───────────────────────────────┘
```

Allow the user to change classifications.

Provide useful classifications such as:

- Hard
- Important
- Needs Attention
- Weak
- High Priority
- Revision Required

The implementation should remain extensible.

---

# 23. DOING MODAL

Click:

```text
Doing
```

Open a dedicated Doing modal.

Display topics currently being worked on.

These should generally be topics that:

- Are not Done
- Have been explicitly marked Doing
- Are currently active

Allow the user to:

- Add topic
- Remove topic
- Mark Done
- Change status
- Open Topic Detail Modal
- Change tags

---

# 24. TO DO MODAL

Click:

```text
To Do
```

Open a dedicated To-Do modal.

Allow the user to add topics directly.

When a topic is added from this Admin Panel modal, it must also appear in the main application's topic system.

For example:

```text
Admin Panel
   ↓
To Do
   ↓
Add "Deadlock Detection"
   ↓
Operating Systems
   ↓
Topic hierarchy updated
   ↓
Add Topics page updated
   ↓
All Topics updated
   ↓
Scheduler can now find it
```

There must be one shared data source.

---

# 25. ALL TOPICS MODAL

Click:

```text
All Topics
```

Open a dedicated All Topics workspace.

This should provide the complete topic inventory.

Allow filtering by:

- Subject
- Status
- Tag
- Difficulty
- Done
- Doing
- To Do
- Starred
- Deadline
- Revision Required

Use the same topic hierarchy used everywhere else.

---

# 26. ADMIN TOPIC TABLE

For a selected subject, topics can be displayed with columns:

```text
Topic
Done
Require Practice
Confidence
Skip
Star
Redo
Lecture Needed
Deadline
Recall Activity
Practice DPP
```

Example:

```text
CPU Scheduling

Done              ☑
Require Practice  ☑
Confidence        High
Skip              ☐
Star              ★
Redo              ☐
Lecture Needed    3
Deadline          30 Aug
Recall Activity   ☑
Practice DPP      ☐
```

Changes must persist immediately.

---

# 27. TOPIC HIERARCHY INTERACTION

Clicking a parent topic should show:

```text
Parent Topic Name

Subtopics
────────────
FCFS
SJF
SRTF
Round Robin
Priority Scheduling
```

Clicking a child should focus the Topic Detail Modal on that child.

The modal must understand the hierarchy.

---

# 28. CONTENT BLOCK SYSTEM

Inside every Topic Detail Modal, allow unlimited blocks.

Possible block types:

```text
Text
Image
Link
Note
Description
Resource
Study Session
```

Provide:

```text
+ Add Block
```

The user should be able to create multiple blocks.

For example:

```text
CPU Scheduling

+ Add Block

[ Notes ]
What is CPU Scheduling?

[ Link ]
https://example.com

[ Image ]
uploaded image

[ Study Session ]
45 minutes
```

Make the blocks easy to reorder/delete/edit.

---

# 29. AUTOMATIC URL DETECTION

When the user pastes a URL into a text/content block:

- Detect it
- Convert it into a clickable link
- Display it cleanly

Do not break ordinary text.

---

# 30. IMAGE SUPPORT

Allow users to attach images/photos to topic content.

Images should:

- Preview immediately
- Be stored persistently where possible
- Be removable
- Be displayed responsively

Do not allow enormous images to destroy the layout.

Use proper compression/resizing strategies where appropriate.

---

# 31. SETTINGS

Create a Settings interface accessible from the application.

Include:

## Backup

Allow the user to export the entire Topic Master database.

Export:

- Subjects
- Topics
- Subtopics
- Tags
- Statuses
- Study sessions
- Study hours
- Schedules
- Notes
- Links
- Metadata
- Deadlines

Use a portable format such as JSON.

Example:

```text
Export Backup
```

---

# 32. IMPORT

Allow the user to import a previously exported Topic Master backup.

Provide:

```text
Import Backup
```

Validate the imported file.

Show a confirmation before overwriting/merging data.

Do not silently destroy existing information.

---

# 33. DATA PERSISTENCE

The application must survive:

- Page refresh
- Browser restart
- Route changes
- Modal changes

Use appropriate browser persistence.

For the initial version, local-first storage is acceptable.

Design the data layer so that a backend/database can be added later without rewriting the entire application.

---

# 34. DESIGN SYSTEM

The UI should look like it was designed in **2026**.

Use:

- Tailwind CSS
- Glassmorphism where appropriate
- Subtle gradients
- Soft shadows
- Rounded cards
- Clean typography
- Excellent spacing
- Smooth transitions
- Micro-interactions
- Hover states
- Active states
- Elegant modals
- Responsive tables
- Beautiful empty states
- Skeleton/loading states where useful

Do not overdo effects.

The goal is:

**Luxury + productivity + clarity.**

Avoid a generic template appearance.

---

# 35. COLOR SYSTEM

Create a consistent design system.

Use semantic colors for:

- Normal
- Urgent
- Important
- Hard
- Doing
- To Do
- Done
- Revision
- Deadline
- Starred

Do not randomly assign colors to components.

Use reusable Tailwind classes/components.

---

# 36. RESPONSIVENESS

The application must work well on:

- Desktop
- Laptop
- Tablet
- Mobile

Admin sidebar must collapse gracefully.

Tables should become horizontally scrollable or transform into cards on small screens.

Modals must fit smaller screens.

---

# 37. UX DETAILS

Add polished interactions such as:

- Confirmation dialogs for destructive actions
- Toast notifications
- Undo where useful
- Smooth modal transitions
- Hover feedback
- Keyboard accessibility
- Clear loading states
- Empty states
- Tooltips for unfamiliar icons
- Search where useful
- Breadcrumbs inside complex hierarchy views

Avoid unnecessary popups.

Keep the application intuitive.

---

# 38. ACCESSIBILITY

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Focus management
- Accessible modals
- ARIA attributes where required
- Sufficient contrast
- Visible focus states

Do not rely only on color to communicate state.

---

# 39. PERFORMANCE

Keep the application fast even with:

```text
100+ subjects
1000+ topics
10,000+ nested topics
```

where practical.

Avoid unnecessary React re-renders.

Use:

- Memoization where justified
- Efficient selectors
- Lazy loading
- Virtualized lists if necessary
- Debounced search
- Efficient persistence

Do not prematurely optimize everything.

---

# 40. EMPTY STATES

Every major section needs a polished empty state.

Examples:

```text
No Subjects Yet

Create your first subject to start organizing your study plan.

[ + Add Subject ]
```

Similarly:

```text
No Topics Yet

Add your first topic to this subject.

[ + Add Topic ]
```

---

# 41. SAMPLE DATA

Include realistic sample/demo data so the application looks populated immediately during development.

Use subjects such as:

```text
Operating Systems
Computer Networks
Computer Organization and Architecture
Database Management Systems
Algorithms
Theory of Computation
Compiler Design
```

Include realistic topics such as:

```text
CPU Scheduling
Process Management
Deadlocks
Memory Management
Virtual Memory
File Systems
```

Include nested subtopics.

Make demo data easy to remove/reset.

---

# 42. ERROR HANDLING

Handle:

- Invalid backup files
- Duplicate subjects
- Empty topic names
- Invalid deadlines
- Invalid study hours
- Invalid lecture counts
- Broken imported data
- Storage failures

Show useful human-readable messages.

---

# 43. CONFIRMATION BEHAVIOR

Destructive actions should never happen accidentally.

Confirm:

- Delete Subject
- Delete Topic
- Delete Subtopic
- Delete Schedule
- Reset Schedule
- Import/overwrite database

Use a reusable confirmation modal.

---

# 44. COMPONENT ARCHITECTURE

Create reusable components such as:

```text
Navbar
SubjectCard
SubjectImportancePill
AddSubjectModal
SubjectDetails
TopicTree
TopicTreeNode
TopicTag
TopicTable
TopicDetailModal
ContentBlock
ContentBlockEditor
StudyTimer
SchedulerWizard
ScheduleTable
AdminLayout
AdminSidebar
AdminNavbar
HardTopicsModal
DoingTopicsModal
TodoTopicsModal
AllTopicsModal
ConfirmationModal
SettingsModal
BackupManager
Toast
```

Do not duplicate these components unnecessarily.

---

# 45. ROUTING

Suggested routes:

```text
/
 /subjects
 /topics
 /scheduler
 /admin
 /settings
```

Admin-specific views can use nested routes or modal/workspace state.

The important requirement is that the Admin Panel behaves as a separate workspace and hides the normal navbar.

---

# 46. GITHUB REPOSITORY

After completing the application, create a GitHub repository named:

```text
Topic-Master
```

or, if GitHub allows the requested exact naming:

```text
Topic Master
```

Use the repository name that is valid according to GitHub's repository naming rules.

Initialize Git properly.

Create:

```text
README.md
.gitignore
LICENSE
```

Commit the project with meaningful commit messages.

---

# 47. README.md

Create a professional README.

Include:

## Topic Master

Short description.

## Features

List all major features.

## Screenshots

Prepare a section for screenshots.

## Tech Stack

Mention:

- React
- Vite
- Tailwind CSS
- React Router
- State management
- Persistence layer

## Installation

Show:

```bash
git clone ...
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

Explain the major folders.

## Usage

Explain how to:

- Create subjects
- Add topics
- Manage hierarchy
- Create schedules
- Use Admin Panel
- Track study time
- Backup/import

## Roadmap

Add future improvements.

## License

Include the selected license.

Make the README look like a serious open-source project.

---

# 48. GITHUB TOPICS / TAGS

Add useful repository topics such as:

```text
react
reactjs
vite
tailwindcss
study-planner
study-management
productivity
education
student-productivity
topic-manager
scheduler
study-tracker
```

Use appropriate GitHub repository metadata.

---

# 49. GITHUB RELEASE

Create a professional GitHub release.

Initial release:

```text
v1.0.0
```

Release title:

```text
Topic Master v1.0.0
```

Release notes should include:

### Highlights

- Subject management
- Hierarchical topic management
- Topic tags
- Study scheduler
- Admin Panel
- Topic detail workspace
- Study time tracking
- Backup/import
- Responsive 2026 UI

### Technical

Mention the major technologies.

### Known Limitations

Clearly document anything intentionally not included.

---

# 50. QUALITY REQUIREMENT

Do not stop after making a visually attractive prototype.

This must be a **functional application**.

Every major UI control must actually work.

Do not create fake buttons.

Do not create placeholder interactions that do nothing.

If something is displayed as:

```text
Done
Star
Deadline
Lecture Needed
Study Time
```

then it must actually persist and participate in the application's data model.

---

# 51. IMPORTANT ARCHITECTURAL RULE

There must be **ONE source of truth for the application's study data**.

For example:

```text
Subject
   ↓
Topics
   ↓
Topic Tags
   ↓
Topic Content
   ↓
Study Sessions
```

Every interface reads/writes the same underlying data.

Therefore:

```text
Scheduler
     ↓
Topic changed
     ↓
Global state updated
     ↓
Admin Panel updated
     ↓
Add Topics updated
     ↓
Subject progress updated
     ↓
Study statistics updated
```

Do not maintain separate fake topic lists for each page.

---

# 52. SCHEDULER + TOPIC DETAIL INTEGRATION

This integration is mandatory.

Suppose the scheduler creates:

```text
COA

Topics:
Cache Memory
Pipelining
Instruction Formats
```

The generated schedule displays those topics.

If the user clicks:

```text
Cache Memory
```

open the exact same Topic Detail Modal used elsewhere.

The modal must contain:

- Topic name
- Subtopics
- Tags
- Notes
- Links
- Images
- Description
- Study time
- Previous study sessions
- Deadline
- Lecture requirement
- Other saved information

Any changes made there must immediately propagate globally.

---

# 53. ADMIN PANEL + TOPIC DETAIL INTEGRATION

The same rule applies to Admin Panel.

If the user opens:

```text
Hard
→ Operating Systems
→ CPU Scheduling
```

and clicks CPU Scheduling,

open the same reusable Topic Detail Modal.

Do not create a second incompatible topic-detail system.

---

# 54. POLISH THE APPLICATION

Before considering the project complete, perform a full UI/UX pass.

Check:

- Alignment
- Spacing
- Typography
- Animations
- Modal sizing
- Mobile layout
- Sidebar behavior
- Table behavior
- Empty states
- Loading states
- Error states
- Keyboard navigation
- Button consistency
- Icon consistency
- Dark/light theme consistency if implemented

The final result should feel cohesive.

---

# 55. TEST THE ENTIRE APPLICATION

Before publishing, manually test the complete workflow:

```text
Create Subject
↓
Assign Importance
↓
Add Topic
↓
Add Subtopics
↓
Nest Subtopics
↓
Promote Subtopic
↓
Delete Topic
↓
Add Topic Tags
↓
Create Schedule
↓
Filter Topics
↓
Open Scheduled Topic
↓
Add Notes
↓
Add Link
↓
Add Image
↓
Start Study Session
↓
Record Study Time
↓
Mark Topic Done
↓
Open Admin Panel
↓
Open Hard
↓
Open Doing
↓
Open To Do
↓
Open All Topics
↓
Change Topic Status
↓
Verify global synchronization
↓
Export Backup
↓
Refresh Application
↓
Verify persistence
↓
Import Backup
↓
Verify data
```

Fix every bug discovered during testing.

---

# 56. FINAL DELIVERABLE

The final project should contain:

```text
Topic Master
├── Fully functional React application
├── Modern Tailwind CSS UI
├── Responsive design
├── Subject management
├── Recursive topic hierarchy
├── Topic tags/statuses
├── Topic Detail Modal
├── Rich content blocks
├── Study time tracking
├── Scheduler
├── Admin Panel
├── Hard workflow
├── Doing workflow
├── To Do workflow
├── All Topics workflow
├── Backup
├── Import
├── Persistent data
├── Error handling
├── README.md
├── LICENSE
├── .gitignore
└── GitHub release v1.0.0
```

# FINAL INSTRUCTION

Build this as if you are shipping a **real professional 2026 study-management product**, not a coding demo.

Prioritize:

**Functionality → Data integrity → UX → Performance → Visual polish.**

Do not simplify away requested functionality merely because it is complicated.

Where the specification leaves a design decision open, choose the solution that produces the most intuitive, scalable, maintainable, and polished experience.

Use modern React patterns, reusable components, clean architecture, and a centralized data model.

Most importantly: **make the application actually work end-to-end.**