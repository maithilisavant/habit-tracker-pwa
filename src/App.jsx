import { useState, useEffect } from 'react'
import { useHabits } from './hooks/useHabits'
import { usePWA } from './hooks/usePWA'
import { useNotifications } from './hooks/useNotifications'
import { HabitForm } from './components/HabitForm'
import { HabitCard } from './components/HabitCard'
import { InstallPrompt } from './components/InstallPrompt'
import { HabitToaster } from './components/HabitToaster'
import './App.css'

function App() {
  const { 
    habits, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleCompletion,
    markComplete,
    markSkip,
    isCompleted,
    isSkipped,
    getCompletionCount,
    getProgress,
    getStreak,
    getTotalRemindersPerDay,
    getSkipCount
  } = useHabits()
  const { installPrompt, isInstalled, isOnline, installApp } = usePWA()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [toasterHabit, setToasterHabit] = useState(null)
  
  const { scheduleHabitReminder, requestPermission } = useNotifications((habit) => {
    setToasterHabit(habit)
  })

  useEffect(() => {
    // Show install prompt after a delay if not installed
    if (installPrompt && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [installPrompt, isInstalled])

  useEffect(() => {
    // Request notification permission on first load
    requestPermission()
  }, [requestPermission])

  useEffect(() => {
    // Schedule reminders for habits with reminder times
    habits.forEach(habit => {
      if (habit.reminderTime) {
        scheduleHabitReminder(habit, habit.reminderTime)
      }
    })
  }, [habits, scheduleHabitReminder])

  const handleAddHabit = (habitData) => {
    addHabit(habitData)
    setShowAddForm(false)
  }

  const handleInstall = async () => {
    const installed = await installApp()
    if (installed) {
      setShowInstallPrompt(false)
    }
  }

  const handleToasterComplete = () => {
    if (toasterHabit) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      markComplete(toasterHabit.id, today)
    }
  }

  const handleToasterSkip = () => {
    if (toasterHabit) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      markSkip(toasterHabit.id, today)
    }
  }

  const handleToasterClose = () => {
    setToasterHabit(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Habit Tracker</h1>
          {!isOnline && (
            <div className="header-status">
              <span className="offline-badge" title="Offline mode">
                Offline
              </span>
            </div>
          )}
        </div>
        <p className="subtitle">Build consistency, one day at a time</p>
      </header>

      <main className="app-main">
        {habits.length === 0 && !showAddForm && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>Start tracking your habits</h2>
            <p>Add your first habit to begin your journey</p>
            <button
              className="btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Habit
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="add-habit-section">
            <HabitForm
              onSubmit={handleAddHabit}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {habits.length > 0 && (
          <div className="habits-list">
            {habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit}
                onToggle={toggleCompletion}
                onComplete={markComplete}
                onSkip={markSkip}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
                isCompleted={isCompleted}
                isSkipped={isSkipped}
                getCompletionCount={getCompletionCount}
                getProgress={getProgress}
                getStreak={getStreak}
                getTotalRemindersPerDay={getTotalRemindersPerDay}
                getSkipCount={getSkipCount}
              />
            ))}
          </div>
        )}

        {habits.length > 0 && !showAddForm && (
          <button
            className="fab"
            onClick={() => setShowAddForm(true)}
            aria-label="Add new habit"
          >
            +
          </button>
        )}
      </main>

      {showInstallPrompt && installPrompt && !isInstalled && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={() => setShowInstallPrompt(false)}
        />
      )}

      {toasterHabit && (
        <HabitToaster
          habit={toasterHabit}
          onComplete={handleToasterComplete}
          onSkip={handleToasterSkip}
          onClose={handleToasterClose}
        />
      )}
    </div>
  )
}

export default App
