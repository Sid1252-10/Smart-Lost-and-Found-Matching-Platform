import confetti from 'canvas-confetti'

/**
 * Fires a pirate treasure celebratory confetti cannon
 * with gold coins, emerald glints, and crimson ribbons!
 */
export function fireTreasureConfetti() {
  const duration = 2.5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 99999 }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  // Initial grand burst
  confetti({
    ...defaults,
    particleCount: 80,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#f0d060', '#d4a843', '#10b981', '#ef4444', '#38bdf8', '#fbbf24', '#ffffff'],
  })

  // Cascading continuous side cannons
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 40 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f0d060', '#d4a843', '#10b981', '#fbbf24'],
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ef4444', '#d4a843', '#10b981', '#38bdf8'],
    })
  }, 220)
}
