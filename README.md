# Habit Tracker PWA

A Progressive Web App for tracking daily habits with offline-first functionality and push notifications.

## Features

✅ **Installable** - Works on desktop and mobile devices  
✅ **Offline-First** - Service Worker caches assets for offline use  
✅ **Push Notifications** - Daily reminders for your habits  
✅ **Local Storage** - All data stored locally in your browser  
✅ **Modern UI** - Clean, responsive design  

## Mental Model

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   App    │  │  Habit   │  │  Habit   │             │
│  │          │  │   Form   │  │   Card   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼──────────────┼───────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ useHabits│  │  usePWA  │  │useNotif  │             │
│  │          │  │          │  │          │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼──────────────┼───────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                    Browser APIs                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │localStor │  │Service   │  │Notif API │             │
│  │  age     │  │ Worker   │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── AppHeader (title, status badges)
├── AppMain
│   ├── EmptyState (when no habits)
│   ├── HabitForm (add/edit habits)
│   └── HabitsList
│       └── HabitCard[]
│           ├── HabitHeader (name, streak, actions)
│           ├── HabitCheck (toggle completion)
│           └── CalendarView (7-day history)
└── InstallPrompt (PWA install banner)
```

### Data Flow

1. **Habit Management** (`useHabits` hook)
   - Stores habits in `localStorage`
   - Provides CRUD operations (create, read, update, delete)
   - Tracks completions by date
   - Calculates streaks

2. **PWA Features** (`usePWA` hook)
   - Registers Service Worker automatically
   - Handles install prompt
   - Monitors online/offline status
   - Auto-updates when new version available

3. **Notifications** (`useNotifications` hook)
   - Requests notification permission
   - Schedules daily reminders
   - Uses browser Notification API

### Service Worker Strategy

- **Cache First**: Static assets (JS, CSS, HTML)
- **Network First**: API calls (if any)
- **Offline Fallback**: Cached version when offline

### State Management

- **Local Storage**: Primary data persistence
- **React State**: UI state and temporary data
- **Service Worker Cache**: App shell and assets

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## PWA Installation

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Or use the install prompt that appears after a few seconds
3. Click "Install" to add to your desktop

### Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Look for the install prompt
2. Or use Chrome menu → "Install app"
3. The app will appear on your home screen

## Offline Usage

Once installed, the app works offline:
- View all your habits
- Mark habits as complete
- Add new habits
- All changes sync when you're back online

## Push Notifications

1. The app will request notification permission on first load
2. Set a reminder time when creating/editing a habit
3. You'll receive notifications at the specified time
4. Notifications work even when the app is closed

## Project Structure

```
habit-tracker-pwa/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── pwa-192x192.png        # App icon (192x192)
│   └── pwa-512x512.png        # App icon (512x512)
├── src/
│   ├── components/
│   │   ├── HabitCard.jsx      # Individual habit display
│   │   ├── HabitForm.jsx      # Add/edit habit form
│   │   └── InstallPrompt.jsx # PWA install banner
│   ├── hooks/
│   │   ├── useHabits.js       # Habit data management
│   │   ├── usePWA.js          # PWA features
│   │   └── useNotifications.js # Push notifications
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styles
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── vite.config.js             # Vite + PWA config
└── package.json
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool
- **vite-plugin-pWA** - PWA support
- **Workbox** - Service Worker management
- **LocalStorage API** - Data persistence
- **Notification API** - Push notifications
- **Service Worker API** - Offline functionality

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Samsung Internet

## License

MIT
