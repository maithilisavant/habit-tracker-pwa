/**
 * Calculate and format the next reminder time for a habit
 * @param {string} reminderTime - Time in HH:MM format
 * @param {number} reminderInterval - Interval in minutes (default: 60)
 * @returns {string} - Formatted string like "Next reminder in 20 min" or "Next reminder on Jan 3"
 */
export function getNextReminderText(reminderTime, reminderInterval = 60) {
  if (!reminderTime) return null

  const [startHours, startMinutes] = reminderTime.split(':').map(Number)
  const now = new Date()
  const startTime = new Date()
  startTime.setHours(startHours, startMinutes, 0, 0)
  
  // Find the next reminder time based on interval
  let nextReminder = new Date(startTime)
  
  // If start time has passed, find the next interval
  if (nextReminder < now) {
    const diffMs = now.getTime() - startTime.getTime()
    const intervalsPassed = Math.floor(diffMs / (reminderInterval * 60 * 1000))
    nextReminder.setMinutes(nextReminder.getMinutes() + ((intervalsPassed + 1) * reminderInterval))
  }
  
  // If next reminder is tomorrow, check if we should show today's last reminder
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  
  if (nextReminder > endOfDay) {
    // Next reminder is tomorrow
    nextReminder.setDate(nextReminder.getDate() + 1)
    nextReminder.setHours(startHours, startMinutes, 0, 0)
  }

  const diffMs = nextReminder.getTime() - now.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) {
    return `Next reminder in ${diffMins} min`
  } else if (diffHours < 24) {
    const remainingMins = diffMins % 60
    if (remainingMins === 0) {
      return `Next reminder in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    }
    return `Next reminder in ${diffHours}h ${remainingMins}m`
  } else {
    // Format date like "Jan 3" or "Jan 3, 2025"
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[nextReminder.getMonth()]
    const day = nextReminder.getDate()
    const year = nextReminder.getFullYear()
    const currentYear = new Date().getFullYear()
    
    if (year === currentYear) {
      return `Next reminder on ${month} ${day}`
    } else {
      return `Next reminder on ${month} ${day}, ${year}`
    }
  }
}

/**
 * Get the next reminder Date object
 * @param {string} reminderTime - Time in HH:MM format
 * @returns {Date|null} - Next reminder date or null
 */
export function getNextReminderDate(reminderTime) {
  if (!reminderTime) return null

  const [hours, minutes] = reminderTime.split(':').map(Number)
  const now = new Date()
  const reminderDate = new Date()
  reminderDate.setHours(hours, minutes, 0, 0)

  // If reminder time has passed today, schedule for tomorrow
  if (reminderDate < now) {
    reminderDate.setDate(reminderDate.getDate() + 1)
  }

  return reminderDate
}

