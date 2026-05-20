// src/utils/unlock.js
// Tracks progress through the birthday experience.
// Both conditions must be true for the secret page to unlock.

export function isSecretUnlocked() {
  return (
    localStorage.getItem('candle_blown') === 'true' &&
    localStorage.getItem('birthday_letter_read') === 'true'
  )
}

export function markCandleBlown() {
  localStorage.setItem('candle_blown', 'true')
}

export function markBirthdayLetterRead() {
  localStorage.setItem('birthday_letter_read', 'true')
}

export function resetProgress() {
  localStorage.removeItem('candle_blown')
  localStorage.removeItem('birthday_letter_read')
}
