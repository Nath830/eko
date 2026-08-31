import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/* ============================================================================
   NOTIFICATIONS INTERNES

   Règle de la démo : aucun bouton ne reste inerte. Quand une action sort du
   périmètre du prototype, elle affiche au moins un message ici.
============================================================================ */

export interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'eko'
  /** Lien facultatif ouvert au clic sur la notification */
  to?: string
  actionLabel?: string
}

interface ToastValue {
  toasts: Toast[]
  notify: (message: string, options?: { tone?: Toast['tone']; to?: string; actionLabel?: string }) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback<ToastValue['notify']>(
    (message, options) => {
      const id = ++nextId
      setToasts((current) => [...current, { id, message, tone: options?.tone ?? 'info', to: options?.to, actionLabel: options?.actionLabel }])
      setTimeout(() => dismiss(id), 5200)
    },
    [dismiss],
  )

  return <ToastContext.Provider value={{ toasts, notify, dismiss }}>{children}</ToastContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast doit être utilisé à l’intérieur de <ToastProvider>')
  return value
}
