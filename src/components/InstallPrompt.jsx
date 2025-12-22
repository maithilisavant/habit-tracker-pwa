import './InstallPrompt.css'

export function InstallPrompt({ onInstall, onDismiss }) {
  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-icon">📱</div>
        <h3>Install Habit Tracker</h3>
        <p>Install this app on your device for a better experience and offline access.</p>
        <div className="install-actions">
          <button onClick={onDismiss} className="btn-secondary">
            Maybe later
          </button>
          <button onClick={onInstall} className="btn-primary">
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
