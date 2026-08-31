import { useCallback, useEffect, useRef, useState } from 'react'
import { thinkingDelay, wait } from '../lib/simulate'

export type GenerationStatus = 'idle' | 'thinking' | 'revealing' | 'done'

/* Génération simulée d'un contenu structuré (résumé, debrief, brouillons).

   Déroulé : squelette pendant 600-1200 ms, puis apparition progressive des
   éléments un par un. `revealed` indique combien d'éléments sont déjà visibles. */
export function useEkoGeneration<T>() {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [result, setResult] = useState<T | null>(null)
  const [revealed, setRevealed] = useState(0)

  // Jeton d'annulation : si l'utilisateur change d'écran en cours de route,
  // la génération précédente n'écrase pas la nouvelle.
  const runId = useRef(0)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const run = useCallback(async (payload: T, steps: number, stepDelay = 140) => {
    const id = ++runId.current
    const isCurrent = () => alive.current && runId.current === id

    setStatus('thinking')
    setResult(null)
    setRevealed(0)

    await wait(thinkingDelay())
    if (!isCurrent()) return

    setResult(payload)
    setStatus('revealing')

    for (let step = 1; step <= steps; step++) {
      await wait(stepDelay)
      if (!isCurrent()) return
      setRevealed(step)
    }

    setStatus('done')
  }, [])

  const reset = useCallback(() => {
    runId.current++
    setStatus('idle')
    setResult(null)
    setRevealed(0)
  }, [])

  return { status, result, revealed, run, reset }
}

/* Apparition mot à mot d'un texte, une fois la réflexion terminée. */
export function useTypewriter(text: string | null, speed = 22) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    if (!text) {
      setShown('')
      return
    }

    const words = text.split(' ')
    let index = 0
    setShown('')

    const timer = setInterval(() => {
      index++
      setShown(words.slice(0, index).join(' '))
      if (index >= words.length) clearInterval(timer)
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return shown
}
