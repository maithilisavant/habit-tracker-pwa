import { useState, useEffect } from 'react'
import { HabitForm } from './HabitForm'
import { 
  Edit, Trash2, CheckCircle2, XCircle, 
  Calendar, Clock, Target, Circle,
  Droplet, Dumbbell, Smile, Book, Coffee, Heart, Moon, Sun, Zap, Bell
} from 'lucide-react'
import { getNextReminderText } from '../utils/reminderUtils'
import './HabitCard.css'

const ICON_MAP = {
  Circle, Droplet, Dumbbell, Smile, Book, Coffee, Heart, Moon, Sun, Zap,
  // Backward compatibility - map old icon names
  Tooth: Smile
}

export function HabitCard({ 
  habit, 
  onToggle, 
  onUpdate, 
  onDelete, 
  onComplete,
  onSkip,
  isCompleted, 
  isSkipped,
  getCompletionCount,
  getProgress,
  getStreak,
  getTotalRemindersPerDay,
  getSkipCount
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [reminderText, setReminderText] = useState(null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Update reminder text periodically
  useEffect(() => {
    if (habit.reminderTime) {
      const updateReminderText = () => {
        setReminderText(getNextReminderText(habit.reminderTime, habit.reminderInterval))
      }
      
      updateReminderText()
      
      // Update every minute
      const interval = setInterval(updateReminderText, 60000)
      
      return () => clearInterval(interval)
    } else {
      setReminderText(null)
    }
  }, [habit.reminderTime, habit.reminderInterval])

  const completed = isCompleted(habit, today)
  const skipped = isSkipped(habit, today)
  const completionCount = getCompletionCount(habit, today)
  const progress = getProgress(habit, today)
  const streak = getStreak(habit)
  const goal = habit.goal?.number || 1
  const unit = habit.goal?.unit || 'times'

  // Calculate display values for habits with reminders
  const hasReminders = habit.reminderTime && habit.reminderInterval
  const totalReminders = hasReminders ? getTotalRemindersPerDay(habit) : goal
  const skipCount = hasReminders ? getSkipCount(habit, today) : 0
  const displayCount = hasReminders ? (totalReminders - skipCount) : completionCount
  const displayTotal = hasReminders ? totalReminders : goal

  // Get icon component dynamically
  const IconComponent = ICON_MAP[habit.icon] || Circle

  const handleUpdate = (updates) => {
    onUpdate(habit.id, updates)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`Delete "${habit.name}"?`)) {
      onDelete(habit.id)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(habit.id, today)
    } else {
      onToggle(habit.id, today)
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip(habit.id, today)
    }
  }

  if (isEditing) {
    return (
      <HabitForm
        initialHabit={habit}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  const progressPercentage = Math.min(progress, 100)
  const isGoalReached = hasReminders ? (displayCount >= totalReminders) : (completionCount >= goal)

  return (
    <div className="habit-card" style={{ borderLeftColor: habit.color }}>
      <div className="habit-header">
        <div className="habit-info">
          <div className="habit-title-row">
            <div className="habit-icon-wrapper" style={{ backgroundColor: `${habit.color}20` }}>
              <IconComponent size={24} color={habit.color} />
            </div>
            <div className="habit-title-group">
              <h3 className="habit-name">{habit.name}</h3>
              {habit.category && (
                <span className="category-badge">{habit.category}</span>
              )}
            </div>
          </div>
          {streak > 0 && (
            <span className="streak-badge">🔥 {streak} day streak</span>
          )}
        </div>
        <div className="habit-actions">
          <button
            className="icon-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit habit"
          >
            <Edit size={18} />
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={handleDelete}
            aria-label="Delete habit"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="habit-progress-section">
        <div className="progress-header">
          <div className="progress-info">
            <Target size={16} />
            <span className="progress-text">
              {displayCount} / {displayTotal} {unit}
            </span>
          </div>
          {isGoalReached && (
            <span className="goal-reached-badge">
              <CheckCircle2 size={16} />
              Goal Reached!
            </span>
          )}
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: habit.color
            }}
          />
        </div>
      </div>

      <div className="habit-actions-section">
        <button
          className={`action-btn-small skip-btn ${skipped ? 'active' : ''}`}
          onClick={handleSkip}
          disabled={isGoalReached}
          title="Skip"
        >
          <XCircle size={16} />
        </button>
        <button
          className={`action-btn-small complete-btn ${completed ? 'active' : ''}`}
          onClick={handleComplete}
          style={{ 
            backgroundColor: isGoalReached ? habit.color : 'transparent',
            borderColor: habit.color,
            color: isGoalReached ? 'white' : habit.color
          }}
          title={isGoalReached ? 'Completed' : 'Complete'}
        >
          <CheckCircle2 size={16} />
        </button>
      </div>

      <div className="habit-meta">
        <div className="meta-left">
          {habit.repeat && (
            <div className="meta-item">
              <Clock size={14} />
              <span>{habit.repeat === 'daily' ? 'Daily' : 'Hourly'}</span>
            </div>
          )}
          {habit.timeOfDay && habit.timeOfDay !== 'anytime' && (
            <div className="meta-item">
              <Calendar size={14} />
              <span>{habit.timeOfDay.charAt(0).toUpperCase() + habit.timeOfDay.slice(1)}</span>
            </div>
          )}
        </div>
        {reminderText && (
          <div className="meta-item reminder-info">
            <Bell size={14} />
            <span>{reminderText}</span>
          </div>
        )}
      </div>
    </div>
  )
}

