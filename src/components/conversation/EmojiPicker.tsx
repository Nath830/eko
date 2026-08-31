import { Smile } from 'lucide-react'
import { Popover } from '../ui/Popover'

const EMOJIS = [
  '👍', '🙏', '👌', '🙌', '👏', '🤝', '✌️', '🤞',
  '🙂', '😄', '😅', '😉', '😍', '🤩', '😌', '😴',
  '🤔', '😬', '😕', '😳', '🥲', '😤', '🙃', '😎',
  '🎉', '🎂', '🔥', '✨', '💡', '⚡', '✅', '❌',
  '📎', '📄', '📅', '⏰', '💬', '📞', '🚀', '🎯',
  '❤️', '💛', '💚', '☕', '🍾', '🌊', '🌞', '🎨',
]

/** Sélecteur d'emojis, disponible sur toutes les plateformes. */
export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <Popover
      align="right"
      triggerClassName="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-hover hover:text-ink-900"
      trigger={<Smile className="h-[17px] w-[17px]" aria-hidden />}
    >
      {(close) => (
        <div className="grid w-[248px] grid-cols-8 gap-0.5">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onPick(emoji)
                close()
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[16px] transition hover:bg-hover"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}
