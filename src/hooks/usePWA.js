import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Register service worker
    const updateSW = registerSW({
      immediate: true,
      onRegisteredSW(swUrl, r) {
        console.log('Service Worker registered:', swUrl)
      },
      onNeedRefresh() {
        console.log('New content available, please refresh')
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      }
    })

    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!installPrompt) return false

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setInstallPrompt(null)
      return true
    }
    
    return false
  }

  return {
    installPrompt,
    isInstalled,
    isOnline,
    installApp
  }
}
