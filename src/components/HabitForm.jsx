import { useState, useEffect } from 'react'
import { 
  Droplet, Dumbbell, Smile, Book, Coffee, Heart, 
  Moon, Sun, Zap, CheckCircle2, X 
} from 'lucide-react'
import './HabitForm.css'

const ICONS = {
  Droplet: Droplet,
  Dumbbell: Dumbbell,
  Smile: Smile,
  Book: Book,
  Coffee: Coffee,
  Heart: Heart,
  Moon: Moon,
  Sun: Sun,
  Zap: Zap
}

const CATEGORIES = ['Health', 'Fitness', 'Personal', 'Work', 'Learning', 'Other']
const TIME_OF_DAY = ['Any Time', 'Morning', 'Afternoon', 'Evening']
const REPEAT_OPTIONS = ['daily', 'hourly']
const REMINDER_INTERVALS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 360, label: '6 hours' },
  { value: 480, label: '8 hours' }
]

export function HabitForm({ onSubmit, onCancel, initialHabit = null }) {
  const [name, setName] = useState(initialHabit?.name || '')
  const [icon, setIcon] = useState(initialHabit?.icon || 'Droplet')
  
  // Map old icon names to new ones for backward compatibility
  const getIconName = (iconName) => {
    if (iconName === 'Tooth') return 'Smile'
    return iconName
  }
  const [color, setColor] = useState(initialHabit?.color || '#6366f1')
  const [category, setCategory] = useState(initialHabit?.category || 'Health')
  const [goalNumber, setGoalNumber] = useState(initialHabit?.goal?.number || 1)
  const [goalUnit, setGoalUnit] = useState(initialHabit?.goal?.unit || 'times')
  const [goalFrequency, setGoalFrequency] = useState(initialHabit?.goal?.frequency || 'Daily')
  const [repeat, setRepeat] = useState(initialHabit?.repeat || 'daily')
  const [timeOfDay, setTimeOfDay] = useState(initialHabit?.timeOfDay || 'anytime')
  const [startDate, setStartDate] = useState(
    initialHabit?.startDate || new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(initialHabit?.endDate || '')
  const [reminderTime, setReminderTime] = useState(initialHabit?.reminderTime || '')
  const [reminderInterval, setReminderInterval] = useState(initialHabit?.reminderInterval || 60)

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        icon,
        color,
        category,
        goal: {
          number: goalNumber,
          unit: goalUnit,
          frequency: goalFrequency
        },
        repeat,
        timeOfDay: timeOfDay.toLowerCase().replace(/\s+/g, ''),
        startDate,
        endDate: endDate || null,
        reminderTime: reminderTime || null,
        reminderInterval: reminderInterval || 60
      })
      // Reset form if not editing
      if (!initialHabit) {
        setName('')
        setIcon('Droplet')
        setColor('#6366f1')
        setCategory('Health')
        setGoalNumber(1)
        setGoalUnit('times')
        setGoalFrequency('Daily')
        setRepeat('daily')
        setTimeOfDay('anytime')
        setStartDate(new Date().toISOString().split('T')[0])
        setEndDate('')
        setReminderTime('')
        setReminderInterval(60)
      }
    }
  }

  const IconComponent = ICONS[getIconName(icon)] || Droplet

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="habit-form-modal">
      <div className="habit-form-overlay" onClick={onCancel}></div>
      <form className="habit-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{initialHabit ? 'Edit Habit' : 'Add Habit'}</h2>
          {onCancel && (
            <button type="button" onClick={onCancel} className="close-btn" aria-label="Close">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="habit-name">Name</label>
          <div className="name-input-wrapper">
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water, Exercise..."
              required
              autoFocus
            />
            <div className="icon-picker-preview">
              <IconComponent size={20} color={color} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Icon</label>
          <div className="icon-picker">
            {Object.keys(ICONS).map((iconName) => {
              const IconComp = ICONS[iconName]
              return (
                <button
                  key={iconName}
                  type="button"
                  className={`icon-option ${icon === iconName ? 'selected' : ''}`}
                  onClick={() => setIcon(iconName)}
                  aria-label={`Select ${iconName} icon`}
                  style={{ color: icon === iconName ? color : '#6b7280' }}
                >
                  <IconComp size={24} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Goal</label>
          <div className="goal-inputs">
            <input
              type="number"
              min="1"
              value={goalNumber}
              onChange={(e) => setGoalNumber(parseInt(e.target.value) || 1)}
              className="goal-number"
              required
            />
            <input
              type="text"
              value={goalUnit}
              onChange={(e) => setGoalUnit(e.target.value)}
              placeholder="e.g., glasses, minutes, pages"
              className="goal-unit"
              required
            />
            <input
              type="text"
              value={goalFrequency}
              onChange={(e) => setGoalFrequency(e.target.value)}
              placeholder="e.g., Daily"
              className="goal-frequency"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="repeat">Repeat</label>
          <select
            id="repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="form-select"
          >
            {REPEAT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'daily' ? 'Every day' : 'Every hour'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="time-of-day">Time of Day</label>
          <select
            id="time-of-day"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="form-select"
          >
            {TIME_OF_DAY.map(time => {
              const value = time.toLowerCase().replace(' ', '')
              return (
                <option key={time} value={value}>
                  {time}
                </option>
              )
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end-date">End Date (optional)</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
            min={startDate}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reminder-time">Reminder Time (optional)</label>
          <input
            id="reminder-time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="form-input"
          />
        </div>

        {reminderTime && (
          <div className="form-group">
            <label htmlFor="reminder-interval">Reminder Interval</label>
            <select
              id="reminder-interval"
              value={reminderInterval}
              onChange={(e) => setReminderInterval(parseInt(e.target.value))}
              className="form-select"
            >
              {REMINDER_INTERVALS.map(interval => (
                <option key={interval.value} value={interval.value}>
                  Every {interval.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-option ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            <CheckCircle2 size={18} style={{ marginRight: '8px' }} />
            {initialHabit ? 'Save' : 'Add'} Habit
          </button>
        </div>
      </form>
    </div>
  )
}
