# Architecture & Mental Model

## Clean Mental Model

This PWA Habit Tracker follows a clean, layered architecture that separates concerns:

### Layer 1: Presentation (UI Components)
- **App.jsx** - Main orchestrator, manages top-level state
- **HabitCard.jsx** - Displays individual habit with completion tracking
- **HabitForm.jsx** - Handles adding/editing habits
- **InstallPrompt.jsx** - PWA installation UI

### Layer 2: Business Logic (Custom Hooks)
- **useHabits** - Habit data management & persistence
  - CRUD operations
  - LocalStorage sync
  - Streak calculation
  - Completion tracking
  
- **usePWA** - Progressive Web App features
  - Service Worker registration
  - Install prompt handling
  - Online/offline detection
  
- **useNotifications** - Push notification management
  - Permission requests
  - Scheduled reminders
  - Notification display

### Layer 3: Browser APIs
- **LocalStorage** - Data persistence
- **Service Worker** - Offline functionality & caching
- **Notification API** - Push notifications
- **Install API** - PWA installation

## Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook (Logic)
    ↓
Browser API (Storage/Network)
    ↓
State Update
    ↓
UI Re-render
```

## State Management Strategy

### Local Storage (Primary)
- All habit data stored in `localStorage`
- Key: `habit-tracker-data`
- Format: JSON array of habit objects
- Syncs automatically on every change

### React State (UI State)
- Form inputs
- Modal visibility
- Install prompt state
- Online/offline status

### Service Worker Cache
- App shell (HTML, CSS, JS)
- Static assets
- Enables offline functionality

## Offline-First Strategy

1. **Service Worker** caches all assets on first load
2. **LocalStorage** stores all user data locally
3. **Network requests** (if any) fall back to cache when offline
4. **UI** shows offline badge when disconnected
5. **Data syncs** automatically when connection restored

## Notification Flow

```
Habit Created/Updated with Reminder Time
    ↓
useNotifications.scheduleHabitReminder()
    ↓
Calculate next reminder time
    ↓
Schedule setTimeout (or use Notification API)
    ↓
Notification appears at scheduled time
    ↓
User can click to open app
```

## Installation Flow

```
User visits app
    ↓
Service Worker registers
    ↓
beforeinstallprompt event fires
    ↓
Install prompt appears (after 3 seconds)
    ↓
User clicks "Install"
    ↓
Browser installs PWA
    ↓
App appears on home screen/desktop
```

## Key Design Decisions

1. **No External Dependencies** - Pure React, no state management library
2. **LocalStorage First** - All data stored locally, no backend required
3. **Service Worker Auto-Registration** - Handled by vite-plugin-pwa
4. **Component Composition** - Small, focused components
5. **Custom Hooks** - Reusable business logic
6. **Progressive Enhancement** - Works without JS, better with it

## File Organization

```
src/
├── components/     # Presentational components
├── hooks/          # Business logic & side effects
├── App.jsx         # Root component
└── main.jsx        # Entry point

public/
├── manifest.json   # PWA manifest
└── icons/          # App icons
```

## Testing the Mental Model

1. **Data Persistence**: Add a habit, refresh page → habit persists
2. **Offline Mode**: Disable network, use app → still works
3. **Installation**: Click install → app appears standalone
4. **Notifications**: Set reminder → notification appears
5. **Streaks**: Complete habits daily → streak counter updates
