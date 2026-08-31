import { findMatchRange } from '../../lib/search'

interface HighlightedTextProps {
  text: string
  /** Terme recherché : il sera surligné s'il apparaît dans le texte */
  query?: string
}

/** Affiche un texte en surlignant le passage qui correspond à la recherche. */
export function HighlightedText({ text, query }: HighlightedTextProps) {
  const range = query ? findMatchRange(text, query) : null
  if (!range) return <>{text}</>

  const [start, end] = range

  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-eko-100 px-0.5 text-ink-900">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}
