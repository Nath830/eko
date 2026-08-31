import { CalendarPlus, Check, X } from 'lucide-react'
import { formatDaySeparator, formatTime } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import { useToast } from '../../store/ToastContext'
import { EkoTag } from '../ui/EkoTag'

/* Rendez-vous détecté par Eko dans un message.
   Accepter crée l'événement dans le calendrier. */
export function EventProposalCard({ proposalId }: { proposalId: string }) {
  const { proposals, acceptProposal, declineProposal } = useEko()
  const { notify } = useToast()

  const proposal = proposals.find((item) => item.id === proposalId)
  if (!proposal) return null

  const when = `${formatDaySeparator(proposal.start).toLowerCase()} à ${formatTime(proposal.start)}`

  return (
    <div className="surface-eko my-2 rounded-2xl border p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <CalendarPlus className="h-3.5 w-3.5 text-eko-600" aria-hidden />
        <span className="text-[12px] font-semibold text-eko-700">Rendez-vous détecté</span>
        <EkoTag className="ml-auto">Eko</EkoTag>
      </div>

      <p className="text-[13px] font-medium text-ink-900">{proposal.title}</p>
      <p className="text-[12.5px] text-ink-700">{when}</p>
      <p className="mt-1 text-[11.5px] text-ink-500 italic">« {proposal.sourceQuote} »</p>

      {proposal.status === 'pending' ? (
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              acceptProposal(proposal.id)
              notify('Rendez-vous ajouté à votre agenda', { tone: 'success', to: '/calendrier', actionLabel: 'Voir le calendrier' })
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-eko-500 px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-eko-600"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Ajouter à l'agenda
          </button>
          <button
            type="button"
            onClick={() => {
              declineProposal(proposal.id)
              notify('Proposition écartée')
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-500 transition hover:text-ink-900"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Ignorer
          </button>
        </div>
      ) : (
        <p className="mt-2 text-[12px] font-medium text-ink-500">
          {proposal.status === 'accepted' ? '✓ Ajouté à votre agenda' : 'Proposition écartée'}
        </p>
      )}
    </div>
  )
}
