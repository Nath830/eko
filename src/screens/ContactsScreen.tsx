import { Link } from 'react-router-dom'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { Avatar } from '../components/ui/Avatar'
import { PlatformLogo } from '../components/ui/PlatformLogo'
import { conversationsOfContact } from '../lib/conversations'
import { useEko } from '../store/EkoStore'

/** Répertoire : une carte par personne, avec ses plateformes. */
export function ContactsScreen() {
  const { contacts, conversations } = useEko()

  return (
    <ScreenFrame title="Contacts" subtitle={`${contacts.length} personnes, tous canaux confondus`}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => {
          const related = conversationsOfContact(conversations, contact.id)
          const unread = related.reduce((total, conversation) => total + conversation.unreadCount, 0)

          return (
            <Link
              key={contact.id}
              to={`/contacts/${contact.id}`}
              className="rounded-2xl border border-line bg-card p-4 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar photo={contact.photo} title={contact.fullName} size={42} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink-900">{contact.fullName}</p>
                  <p className="truncate text-[12px] text-ink-500">
                    {[contact.role, contact.company].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">{contact.ekoSummary}</p>

              <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3">
                {contact.handles.map((handle) => (
                  <PlatformLogo key={handle.platform} platform={handle.platform} size={16} />
                ))}
                <span className="ml-auto text-[11.5px] text-ink-400 tabular-nums">
                  {related.length} conversation{related.length > 1 ? 's' : ''}
                  {unread > 0 && ` · ${unread} non lus`}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </ScreenFrame>
  )
}
