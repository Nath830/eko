import { Folder, MessageSquare, Tag, User, X } from 'lucide-react'
import { cx } from '../../lib/cx'
import type { Mention, MentionKind } from '../../types'

const ICONS: Record<MentionKind, typeof User> = {
  contact: User,
  conversation: MessageSquare,
  topic: Folder,
  label: Tag,
}

interface MentionChipProps {
  mention: Mention
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

/** Ce qu'une note cite, affiché en étiquette. */
export function MentionChip({ mention, onRemove, onClick, className }: MentionChipProps) {
  const Icon = ICONS[mention.kind]

  return (
    <span
      className={cx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full bg-eko-50 py-1 pr-1.5 pl-2 text-[11.5px] font-medium text-eko-700',
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />

      {onClick ? (
        <button type="button" onClick={onClick} className="truncate transition hover:underline">
          {mention.label}
        </button>
      ) : (
        <span className="truncate">{mention.label}</span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Retirer ${mention.label}`}
          className="rounded-full p-0.5 text-eko-600 transition hover:bg-card"
        >
          <X className="h-3 w-3" aria-hidden />
        </button>
      )}
    </span>
  )
}
