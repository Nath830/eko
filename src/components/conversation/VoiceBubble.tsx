import { FileText, Mic, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import { formatDuration } from '../../lib/conversations'
import { cx } from '../../lib/cx'
import type { VoiceNote } from '../../types'
import { EkoTag } from '../ui/EkoTag'
import { Skeleton } from '../ui/Skeleton'

/* Message vocal : lecture simulée (la forme d'onde se remplit, le compteur
   avance) et transcription pré-écrite révélée à la demande. */
export function VoiceBubble({ voice, mine }: { voice: VoiceNote; mine?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const timer = useRef<number | null>(null)
  const transcription = useEkoGeneration<string>()

  // Forme d'onde stable : dérivée de la durée, jamais aléatoire d'un rendu à l'autre.
  const bars = Array.from({ length: 38 }, (_, index) => 20 + ((index * 41 + voice.durationSec) % 62))
  const progress = voice.durationSec > 0 ? elapsed / voice.durationSec : 0

  useEffect(() => {
    if (!playing) return

    // La lecture est accélérée : une démonstration ne dure pas 1 min 40.
    timer.current = window.setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= voice.durationSec) {
          setPlaying(false)
          return 0
        }
        return current + 1
      })
    }, 90)

    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing, voice.durationSec])

  function revealTranscript() {
    setShowTranscript(true)
    void transcription.run(voice.transcript, 1)
  }

  return (
    <div className="min-w-[240px]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? 'Mettre en pause' : 'Écouter le message vocal'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-ink-700 shadow-sm transition hover:text-eko-600"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="ml-0.5 h-4 w-4" aria-hidden />}
        </button>

        <span className="flex h-8 flex-1 items-center gap-[2px]" aria-hidden>
          {bars.map((height, index) => (
            <span
              key={index}
              className={cx(
                'w-[2px] shrink-0 rounded-full transition-colors',
                index / bars.length <= progress ? 'bg-eko-500' : 'bg-ink-200',
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </span>

        <span className="shrink-0 text-[11.5px] text-ink-500 tabular-nums">
          {playing || elapsed > 0 ? formatDuration(elapsed) : formatDuration(voice.durationSec)}
        </span>
      </div>

      {!mine && (
        <>
          {!showTranscript ? (
            <button
              type="button"
              onClick={revealTranscript}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-[12px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:text-eko-700"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Transcrire
            </button>
          ) : (
            <div className="surface-eko mt-2 rounded-xl border p-2.5">
              <div className="mb-1.5 flex items-center gap-2">
                <Mic className="h-3 w-3 text-eko-600" aria-hidden />
                <span className="text-[11px] font-semibold text-eko-700">Transcription</span>
                <EkoTag className="ml-auto">Eko</EkoTag>
              </div>

              {transcription.status === 'thinking' ? (
                <div className="space-y-1.5">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-3/4" />
                </div>
              ) : (
                <p className="text-[12.5px] leading-relaxed text-ink-700">{transcription.result}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
