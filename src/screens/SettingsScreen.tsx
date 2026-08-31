import { Play, RotateCcw } from 'lucide-react'
import { PLATFORM_IDS, getPlatform } from '../config/platforms'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { PlatformLogo } from '../components/ui/PlatformLogo'
import { scriptedTriggers } from '../data/alerts'
import { useEko } from '../store/EkoStore'
import { useToast } from '../store/ToastContext'

/** Réglages de la démonstration. */
export function SettingsScreen() {
  const { resetDemo, runScriptedTrigger, conversations, contacts, notes, alerts } = useEko()
  const { notify } = useToast()

  const messageCount = conversations.reduce((total, conversation) => total + conversation.messages.length, 0)

  return (
    <ScreenFrame title="Réglages" subtitle="Paramètres de la démonstration" width="narrow">
      <div className="space-y-5">
        <section className="rounded-2xl border border-line bg-card p-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Comptes connectés</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-500">
            Six plateformes réunies dans Eko. Cette démonstration n'établit aucune connexion réelle.
          </p>

          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {PLATFORM_IDS.map((id) => (
              <div key={id} className="flex items-center gap-2.5 rounded-xl bg-ground px-3 py-2">
                <PlatformLogo platform={id} size={17} />
                <span className="text-[13px] text-ink-900">{getPlatform(id).name}</span>
                <span className="ml-auto text-[11.5px] font-medium text-ok">Connecté</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Séquences de démonstration</h2>
          <p className="mt-0.5 text-[12.5px] text-ink-500">
            Déclenchez un message entrant qui correspond à une alerte, au moment de votre choix.
          </p>

          <div className="mt-3 space-y-1.5">
            {scriptedTriggers.map((trigger) => (
              <button
                key={trigger.id}
                type="button"
                onClick={() => {
                  runScriptedTrigger(trigger)
                  notify(trigger.notification, {
                    tone: 'eko',
                    to: `/reception/${trigger.conversationId}`,
                    actionLabel: 'Ouvrir la conversation',
                  })
                }}
                className="flex w-full items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 text-left transition hover:border-eko-500/40 hover:bg-eko-50"
              >
                <Play className="h-3.5 w-3.5 shrink-0 text-eko-600" aria-hidden />
                <span className="text-[13px] text-ink-900">{trigger.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Contenu de la démonstration</h2>
          <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ['Conversations', conversations.length],
              ['Messages', messageCount],
              ['Contacts', contacts.length],
              ['Notes', notes.length],
              ['Alertes', alerts.length],
              ['Plateformes', PLATFORM_IDS.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-ground px-3 py-2.5">
                <dt className="text-[11.5px] text-ink-500">{label}</dt>
                <dd className="text-[17px] font-semibold text-ink-900 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-card p-4">
          <h2 className="text-[14px] font-semibold text-ink-900">Réinitialiser la démo</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
            Remet les conversations, les non-lus, les alertes, les notes et le calendrier dans leur état initial.
            À utiliser entre deux présentations.
          </p>

          <button
            type="button"
            onClick={() => {
              resetDemo()
              notify('Démonstration réinitialisée', { tone: 'success' })
            }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-[13px] font-medium text-ink-700 transition hover:border-danger/40 hover:text-danger"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Réinitialiser la démo
          </button>
        </section>
      </div>
    </ScreenFrame>
  )
}
