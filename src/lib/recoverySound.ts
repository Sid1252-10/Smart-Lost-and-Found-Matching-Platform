import { playConfettiAudio } from './confetti'

/**
 * Plays a triumphant recovery sound when a claim is marked as recovered.
 * Uses the user's celebratory MP3 fanfare with Web Audio synth fallback.
 */
export function playRecoverySound() {
  try {
    playConfettiAudio()
  } catch (err) {
    playSynthFallback()
  }
}

function playSynthFallback() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Fanfare: 4 ascending notes in quick succession
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    const times = [0, 0.12, 0.24, 0.38]
    const durations = [0.22, 0.22, 0.22, 0.55]

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + times[i])

      // Quick attack, smooth release
      gain.gain.setValueAtTime(0, ctx.currentTime + times[i])
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + times[i] + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[i] + durations[i])

      osc.start(ctx.currentTime + times[i])
      osc.stop(ctx.currentTime + times[i] + durations[i] + 0.05)

      // Close context after last note finishes
      if (i === notes.length - 1) {
        osc.onended = () => {
          setTimeout(() => ctx.close(), 200)
        }
      }
    })
  } catch (err) {
    console.debug('Recovery sound fallback unavailable:', err)
  }
}

