import { useEffect, useRef } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import './HabitToaster.css'

export function HabitToaster({ habit, onComplete, onSkip, onClose }) {
  const audioRef = useRef(null)

  useEffect(() => {
    // Play notification sound from audio file
    const playSound = () => {
      try {
        // Create new audio instance each time to ensure it plays
        const audio = new Audio('/mixkit-guitar-notification-alert-2320.wav')
        audio.volume = 0.7
        audioRef.current = audio
        
        audio.play().catch(error => {
          console.warn('Could not play notification sound:', error)
        })
      } catch (error) {
        console.warn('Could not play notification sound:', error)
      }
    }

    playSound()

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      onClose()
    }, 10000)

    return () => {
      clearTimeout(timer)
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }
  }, [onClose])

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
    onClose()
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    }
    onClose()
  }

  if (!habit) return null

  return (
    <div className="habit-toaster">
        <div className="toaster-content">
          <div className="toaster-title">{habit.name}</div>
          <div className="toaster-actions">
            <button
              className="toaster-btn toaster-skip"
              onClick={handleSkip}
              aria-label="Skip"
            >
              <X size={20} />
            </button>
            <button
              className="toaster-btn toaster-complete"
              onClick={handleComplete}
              aria-label="Complete"
              style={{ color: habit.color, borderColor: habit.color }}
            >
              <CheckCircle2 size={20} />
            </button>
          </div>
        </div>
      </div>
  )
}

