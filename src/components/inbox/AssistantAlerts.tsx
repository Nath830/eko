import { Bell, BellOff, Sparkles } from 'lucide-react'
import { getPlatform } from '../../config/platforms'
import { cx } from '../../lib/cx'
import { formatDaySeparator, formatTime } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'

/* Ce qu'Eko surveille, et ce qui s'est déclenché.

   Les alertes n'ont plus d'écran à elles : on les crée et on les consulte
   dans l'assistant, en lui parlant. */
interface AssistantAlertsProps {
  /** Ouvrir la conversation, sur place ou dans la réception */
  onOpen: (conversationId: string, messageId?: string) => void
}

export function AssistantAlerts({ onOpen }: AssistantAlertsProps) {
  const { alerts, alertHits, contacts, getConversation, toggleAlert, markHitRead, unreadAlerts } = useEko()

  const active = alerts.filter((alert) => alert.active)

  return (
    <div className="p-3.5">
      <div className="surface-eko rounded-2xl border p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-eko-600" aria-hidden />
          <span className="text-[13px] font-semibold text-eko-700">Ce que je surveille</span>
          <EkoTag className="ml-auto">Eko</EkoTag>
        </div>

        <p className="mb-3 text-[13px] leading-relaxed text-ink-700">
          {active.length} alerte{active.length > 1 ? 's' : ''} active{active.length > 1 ? 's' : ''} sur vos six
          plateformes.
          {unreadAlerts > 0
            ? ` ${unreadAlerts} message${unreadAlerts > 1 ? 's ont' : ' a'} correspondu depuis votre dernier passage.`
            : " Rien de nouveau n'a correspondu."}
        </p>

        {/* Les déclenchements */}
        {alertHits.length > 0 && (
          <div className="mb-3.5">
            <h4 className="mb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
              Messages déclenchés
            </h4>

            <ul className="space-y-1.5">
              {alertHits.map((hit) => {
                const conversation = getConversation(hit.conversationId)
                const alert = alerts.find((item) => item.id === hit.alertId)
                const message = conversation?.messages.find((item) => item.id === hit.messageId)
                if (!conversation) return null

                return (
                  <li key={hit.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markHitRead(hit.id)
                        onOpen(conversation.id, hit.messageId)
                      }}
                      className={cx(
                        'block w-full rounded-xl border p-3 text-left transition hover:shadow-sm',
                        hit.isRead ? 'border-line bg-card' : 'border-eko-500/35 bg-card',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <PlatformLogo platform={conversation.platform} size={15} />
                        <span className="truncate text-[12.5px] font-semibold text-ink-900">
                          {conversation.title}
                        </span>
                        {!hit.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-eko-accent" />}
                        <span className="ml-auto shrink-0 text-[11px] text-ink-400">
                          {formatDaySeparator(hit.triggeredAt)} · {formatTime(hit.triggeredAt)}
                        </span>
                      </span>

                      {alert && (
                        <span className="mt-1 block text-[11.5px] text-eko-700 italic">« {alert.query} »</span>
                      )}

                      <span className="mt-1 line-clamp-2 block text-[12px] leading-relaxed text-ink-600">
                        {message?.text ?? conversation.ekoDigest}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Les alertes elles-mêmes */}
        <h4 className="mb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">Vos alertes</h4>

        <ul className="space-y-1">
          {alerts.map((alert) => {
            const contact = contacts.find((item) => item.id === alert.contactId)

            return (
              <li key={alert.id} className="flex items-start gap-2.5 rounded-xl bg-card px-3 py-2.5">
                <span
                  className={cx(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                    alert.active ? 'bg-eko-100 text-eko-700' : 'bg-ground text-ink-200',
                  )}
                >
                  {alert.active ? <Bell className="h-2.5 w-2.5" /> : <BellOff className="h-2.5 w-2.5" />}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cx(
                      'block text-[12.5px] leading-snug',
                      alert.active ? 'text-ink-900' : 'text-ink-400 line-through',
                    )}
                  >
                    {alert.query}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ink-400">
                    {contact ? contact.fullName : 'Tous les contacts'} ·{' '}
                    {alert.scope === 'all' ? 'toutes plateformes' : getPlatform(alert.scope).name}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => toggleAlert(alert.id)}
                  aria-pressed={alert.active}
                  aria-label={alert.active ? "Désactiver l'alerte" : "Activer l'alerte"}
                  className={cx(
                    'mt-0.5 h-5 w-9 shrink-0 rounded-full p-0.5 transition',
                    alert.active ? 'bg-eko-500' : 'bg-line',
                  )}
                >
                  <span
                    className={cx('block h-4 w-4 rounded-full bg-white transition', alert.active && 'translate-x-4')}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-3 border-t border-eko-100 pt-2.5 text-[12px] text-ink-500">
          Dites-moi « préviens-moi si… » pour en créer une nouvelle.
        </p>
      </div>
    </div>
  )
}
