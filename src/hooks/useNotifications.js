import { useEffect, useRef, useCallback } from 'react'

export function useNotifications(onToasterShow) {
  const notificationPermission = useRef(Notification.permission)
  const scheduledTimers = useRef(new Map())

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        notificationPermission.current = permission
      })
    }

    // Update permission status when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        notificationPermission.current = Notification.permission
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    notificationPermission.current = permission
    return permission === 'granted'
  }, [])

  const showBrowserNotification = useCallback((habit) => {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return false
    }

    try {
      // Play notification sound
      try {
        const audio = new Audio('/mixkit-guitar-notification-alert-2320.wav')
        audio.volume = 0.7
        audio.play().catch(err => {
          console.warn('Could not play notification sound:', err)
        })
      } catch (audioError) {
        console.warn('Audio playback error:', audioError)
      }

      const goal = habit.goal?.number || 1
      const unit = habit.goal?.unit || 'times'
      const notification = new Notification(`⏰ ${habit.name}`, {
        body: `Time to complete your habit! Goal: ${goal} ${unit}`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: `habit-${habit.id}-${Date.now()}`,
        requireInteraction: false,
        silent: false,
        vibrate: [200, 100, 200],
        sound: '/mixkit-guitar-notification-alert-2320.wav',
        data: {
          habitId: habit.id,
          habitName: habit.name
        },
        timestamp: Date.now()
      })

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        notification.close()
        // Optionally trigger toaster when user clicks notification
        if (onToasterShow) {
          onToasterShow(habit)
        }
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return true
    } catch (error) {
      console.error('Error showing notification:', error)
      return false
    }
  }, [onToasterShow])

  const scheduleHabitReminder = useCallback((habit, reminderTime) => {
    if (!reminderTime) return false

    // Clear any existing timers for this habit
    const existingTimers = scheduledTimers.current.get(habit.id)
    if (existingTimers) {
      if (Array.isArray(existingTimers)) {
        existingTimers.forEach(timer => clearTimeout(timer))
      } else {
        clearTimeout(existingTimers)
      }
    }

    const intervalMinutes = habit.reminderInterval || 60
    const [startHours, startMinutes] = reminderTime.split(':').map(Number)
    const now = new Date()
    const timers = []

    // Function to schedule reminders for a specific day
    const scheduleForDay = (dayDate) => {
      const startTime = new Date(dayDate)
      startTime.setHours(startHours, startMinutes, 0, 0)
      
      const endOfDay = new Date(dayDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      let currentTime = new Date(startTime)
      
      // If this is today and start time has passed, find next interval
      if (dayDate.toDateString() === now.toDateString() && startTime < now) {
        const minutesSinceStart = Math.floor((now.getTime() - startTime.getTime()) / (60 * 1000))
        const intervalsPassed = Math.floor(minutesSinceStart / intervalMinutes)
        currentTime.setMinutes(currentTime.getMinutes() + ((intervalsPassed + 1) * intervalMinutes))
      }
      
      // Schedule all reminders for this day
      while (currentTime <= endOfDay) {
        const delay = currentTime.getTime() - now.getTime()
        if (delay > 0) {
          timers.push(setTimeout(() => {
            // Show browser notification
            showBrowserNotification(habit)
            // Also show toaster if user is on the page
            if (onToasterShow) {
              onToasterShow(habit)
            }
          }, delay))
        }
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes)
      }
    }

    // Schedule for today and next 7 days
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(now)
      dayDate.setDate(dayDate.getDate() + i)
      scheduleForDay(dayDate)
    }

    // Set up recurring scheduler for future days
    const scheduleRecurring = () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(startHours, startMinutes, 0, 0)
      
      const delayUntilTomorrow = tomorrow.getTime() - now.getTime()
      
      const recurringTimer = setTimeout(() => {
        // Schedule for the next 7 days
        for (let i = 0; i < 7; i++) {
          const dayDate = new Date()
          dayDate.setDate(dayDate.getDate() + i + 1)
          scheduleForDay(dayDate)
        }
        
        // Continue scheduling
        scheduleRecurring()
      }, delayUntilTomorrow)
      
      timers.push(recurringTimer)
    }

    scheduleRecurring()

    if (timers.length > 0) {
      scheduledTimers.current.set(habit.id, timers)
      return true
    }
    return false
  }, [onToasterShow, showBrowserNotification])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      scheduledTimers.current.forEach(timers => {
        if (Array.isArray(timers)) {
          timers.forEach(timer => clearTimeout(timer))
        } else {
          clearTimeout(timers)
        }
      })
      scheduledTimers.current.clear()
    }
  }, [])

  return {
    requestPermission,
    scheduleHabitReminder,
    showBrowserNotification,
    hasPermission: notificationPermission.current === 'granted'
  }
}
