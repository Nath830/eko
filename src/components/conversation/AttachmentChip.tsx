import { Download, FileText, Image as ImageIcon, ReceiptText, ScrollText } from 'lucide-react'
import { useToast } from '../../store/ToastContext'
import type { Attachment } from '../../types'

const ICONS = {
  devis: ReceiptText,
  contrat: ScrollText,
  facture: ReceiptText,
  document: FileText,
  image: ImageIcon,
} as const

const LABELS = {
  devis: 'Devis',
  contrat: 'Contrat',
  facture: 'Facture',
  document: 'Document',
  image: 'Image',
} as const

/** Pièce jointe affichée dans une bulle de message. */
export function AttachmentChip({ attachment }: { attachment: Attachment }) {
  const Icon = ICONS[attachment.kind]
  const { notify } = useToast()

  return (
    <button
      type="button"
      onClick={() =>
        notify(`${attachment.fileName} — l'ouverture des pièces jointes n'est pas active dans cette démonstration`)
      }
      className="mt-2 flex w-full items-center gap-2.5 rounded-xl border border-line bg-card/70 px-2.5 py-2 text-left transition hover:border-eko-500/40">
      {attachment.previewUrl ? (
        <img src={attachment.previewUrl} alt={attachment.fileName} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ground text-ink-500">
          <Icon className="h-[17px] w-[17px]" aria-hidden />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-medium text-ink-900">{attachment.fileName}</span>
        <span className="block text-[11px] text-ink-400">
          {LABELS[attachment.kind]} · {attachment.sizeLabel}
        </span>
      </span>

      <Download className="h-3.5 w-3.5 shrink-0 text-ink-200" aria-hidden />
    </button>
  )
}
