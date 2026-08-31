import { InboxList } from './InboxList'

/** La colonne de gauche : la réception, et rien d'autre.
    Le dossier d'un sujet s'ouvre désormais en surimpression, depuis la
    conversation elle-même. */
export function InboxPanel({ activeId }: { activeId?: string }) {
  return (
    <div className="card flex h-full min-h-0 flex-col overflow-hidden">
      <InboxList activeId={activeId} />
    </div>
  )
}
