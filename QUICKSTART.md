# Quick Start Guide

## 🚀 Getting Started

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - Visit `http://localhost:5173`
   - The app will automatically register the Service Worker

## 📱 Testing PWA Features

### Installation
- **Desktop (Chrome/Edge)**: Look for install icon in address bar
- **Mobile**: Use browser's "Add to Home Screen" option
- An install prompt will appear after 3 seconds

### Offline Mode
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Refresh the page
4. App should still work! ✅

### Notifications
1. Add a habit with a reminder time
2. Allow notifications when prompted
3. You'll receive a notification at the specified time

## 🏗️ Project Structure

```
habit-tracker-pwa/
├── src/
│   ├── components/      # UI components
│   ├── hooks/           # Business logic
│   └── App.jsx          # Main app
├── public/              # Static assets & manifest
└── vite.config.js       # Vite + PWA config
```

## 🎯 Key Features Implemented

✅ **Installable** - Works on desktop & mobile  
✅ **Offline-First** - Service Worker caches everything  
✅ **Push Notifications** - Daily habit reminders  
✅ **Local Storage** - All data persists locally  
✅ **Modern UI** - Clean, responsive design  

## 📚 Learn More

- See `README.md` for full documentation
- See `ARCHITECTURE.md` for mental model explanation

## 🐛 Troubleshooting

**Service Worker not registering?**
- Make sure you're using HTTPS or localhost
- Check browser console for errors

**Notifications not working?**
- Check browser notification permissions
- Some browsers require user interaction first

**Icons not showing?**
- Replace placeholder icons in `public/` with your own
- See `public/ICONS.md` for details
