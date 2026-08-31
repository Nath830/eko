import { Fragment } from 'react'
import { PLATFORM_IDS, getPlatform, type PlatformId } from '../../config/platforms'
import { useEko } from '../../store/EkoStore'
import { PlatformLogo } from '../ui/PlatformLogo'

interface RichTextProps {
  text: string
  onOpenContact?: (contactId: string) => void
  onOpenPlatform?: (platform: PlatformId) => void
}

/* Le texte d'Eko, avec les noms et les applications transformés en étiquettes.

   On repère les personnes de votre répertoire et les six plateformes, puis on
   les rend cliquables : le nom ouvre la conversation la plus récente avec
   cette personne, le logo ouvre l'application. */
export function RichText({ text, onOpenContact, onOpenPlatform }: RichTextProps) {
  const { contacts } = useEko()

  // Les libellés reconnus, du plus long au plus court pour éviter les
  // découpages partiels (« Julien Meyer » avant « Julien »).
  const tokens: { label: string; contactId?: string; platform?: PlatformId }[] = [
    ...contacts.flatMap((contact) => [
      { label: contact.fullName, contactId: contact.id },
      { label: contact.fullName.split(' ')[0], contactId: contact.id },
    ]),
    ...PLATFORM_IDS.map((id) => ({ label: getPlatform(id).name, platform: id })),
  ].sort((a, b) => b.label.length - a.label.length)

  const pattern = new RegExp(`\\b(${tokens.map((token) => escapeRegExp(token.label)).join('|')})\\b`, 'g')
  const pieces = text.split(pattern)

  return (
    <>
      {pieces.map((piece, index) => {
        const token = tokens.find((item) => item.label === piece)
        if (!token) return <Fragment key={index}>{piece}</Fragment>

        if (token.platform) {
          return (
            <button
              key={index}
              type="button"
              onClick={() => onOpenPlatform?.(token.platform!)}
              className="mx-0.5 inline-flex translate-y-[1px] items-center gap-1 rounded-md bg-ground px-1.5 py-0.5 align-baseline text-[0.92em] font-medium text-ink-900 transition hover:bg-eko-50"
            >
              <PlatformLogo platform={token.platform} size={12} />
              {piece}
            </button>
          )
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => onOpenContact?.(token.contactId!)}
            className="mx-0.5 inline-flex translate-y-[1px] items-center rounded-md bg-eko-50 px-1.5 py-0.5 align-baseline text-[0.92em] font-medium text-eko-700 transition hover:bg-eko-100"
          >
            {piece}
          </button>
        )
      })}
    </>
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
