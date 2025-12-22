import { useState, useEffect } from 'react'

const STORAGE_KEY = 'habit-tracker-data'

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits])

  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      icon: habit.icon || 'Circle',
      color: habit.color || '#6366f1',
      category: habit.category || 'Health',
      goal: {
        number: habit.goal?.number || 1,
        unit: habit.goal?.unit || 'times',
        frequency: habit.goal?.frequency || 'Daily'
      },
      repeat: habit.repeat || 'daily',
      timeOfDay: habit.timeOfDay || 'anytime',
      startDate: habit.startDate || new Date().toISOString().split('T')[0],
      endDate: habit.endDate || null,
      reminderTime: habit.reminderTime || null,
      reminderInterval: habit.reminderInterval || 60,
      createdAt: new Date().toISOString(),
      completions: {},
      skips: {}
    }
    setHabits([...habits, newHabit])
    return newHabit
  }

  const updateHabit = (id, updates) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ))
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  const markComplete = (habitId, date) => {
    const dateKey = date.toISOString().split('T')[0]
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions }
        const skips = { ...habit.skips }
        // Decrement skip count if there are skips (don't delete, just reduce)
        if (skips[dateKey]) {
          const skipCount = typeof skips[dateKey] === 'boolean' ? 1 : (skips[dateKey] || 0)
          if (skipCount > 1) {
            skips[dateKey] = skipCount - 1
          } else {
            delete skips[dateKey]
          }
        }
        // Add to completions
        completions[dateKey] = completions[dateKey] ? completions[dateKey] + 1 : 1
        return { ...habit, completions, skips }
      }
      return habit
    }))
  }

  const markSkip = (habitId, date) => {
    const dateKey = date.toISOString().split('T')[0]
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions }
        const skips = { ...habit.skips }
        // Increment skip count (don't delete completions)
        // Handle backward compatibility: boolean true becomes count 1
        const currentSkipCount = typeof skips[dateKey] === 'boolean' ? 1 : (skips[dateKey] || 0)
        skips[dateKey] = currentSkipCount + 1
        return { ...habit, completions, skips }
      }
      return habit
    }))
  }

  const toggleCompletion = (habitId, date) => {
    const dateKey = date.toISOString().split('T')[0]
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completions = { ...habit.completions }
        const skips = { ...habit.skips }
        if (completions[dateKey]) {
          delete completions[dateKey]
        } else {
          delete skips[dateKey]
          completions[dateKey] = completions[dateKey] ? completions[dateKey] + 1 : 1
        }
        return { ...habit, completions, skips }
      }
      return habit
    }))
  }

  const isCompleted = (habit, date) => {
    const dateKey = date.toISOString().split('T')[0]
    const completion = habit.completions[dateKey]
    // For backward compatibility, treat boolean true as completed
    if (completion === true) return true
    // Check if completion count meets or exceeds goal
    const goal = habit.goal?.number || 1
    return (completion || 0) >= goal
  }

  const isSkipped = (habit, date) => {
    const dateKey = date.toISOString().split('T')[0]
    const skipValue = habit.skips && habit.skips[dateKey]
    // Handle backward compatibility: boolean true means skipped
    if (typeof skipValue === 'boolean') return skipValue
    return !!(skipValue && skipValue > 0)
  }

  // Calculate total reminders per day based on reminder interval
  const getTotalRemindersPerDay = (habit) => {
    if (!habit.reminderTime || !habit.reminderInterval) {
      // If no reminders, use goal as total
      return habit.goal?.number || 1
    }
    // For habits with reminders, use goal as the total expected reminders
    // This represents how many times the user should complete the habit per day
    return habit.goal?.number || 1
  }

  const getSkipCount = (habit, date) => {
    const dateKey = date.toISOString().split('T')[0]
    const skipValue = habit.skips && habit.skips[dateKey]
    // Handle backward compatibility: boolean true means 1 skip
    if (typeof skipValue === 'boolean') return skipValue ? 1 : 0
    return skipValue || 0
  }

  const getCompletionCount = (habit, date) => {
    const dateKey = date.toISOString().split('T')[0]
    const completion = habit.completions[dateKey]
    // For backward compatibility, treat boolean true as 1 completion
    if (completion === true) return 1
    return completion || 0
  }

  const getProgress = (habit, date) => {
    const dateKey = date.toISOString().split('T')[0]
    const completion = habit.completions[dateKey]
    // For backward compatibility, treat boolean true as 1 completion
    const completed = completion === true ? 1 : (completion || 0)
    
    // If habit has reminders, calculate progress based on total reminders minus skips
    if (habit.reminderTime && habit.reminderInterval) {
      const totalReminders = getTotalRemindersPerDay(habit)
      const skipped = getSkipCount(habit, date)
      // Progress = (total - skipped) / total
      const effectiveCount = totalReminders - skipped
      return Math.min((effectiveCount / totalReminders) * 100, 100)
    }
    
    // For habits without reminders, use goal-based progress
    const goal = habit.goal?.number || 1
    return Math.min((completed / goal) * 100, 100)
  }

  const getStreak = (habit) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    let currentDate = new Date(today)
    const goalNumber = habit.goal?.number || 1

    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0]
      const completionCount = habit.completions[dateKey]
      // For backward compatibility, treat boolean true as 1 completion
      const count = completionCount === true ? 1 : (completionCount || 0)
      if (count >= goalNumber) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  return {
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
  }
}
