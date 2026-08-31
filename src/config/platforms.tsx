import type { ComponentType, SVGProps } from 'react'

/* ============================================================================
   REGISTRE DES PLATEFORMES

   👉 POUR AJOUTER UNE PLATEFORME (Telegram, Messenger, Teams…) :
      ajouter une entrée ci-dessous. Rail, filtres, badges, couleurs, compteurs
      et écrans s'adaptent automatiquement.

   Les logos sont dessinés aux vraies couleurs de chaque marque.
============================================================================ */

type LogoComponent = ComponentType<SVGProps<SVGSVGElement>>

export interface PlatformMeta {
  name: string
  /** Couleur dominante de la marque : accents, teintes, points de couleur */
  color: string
  /** Teinte très pâle : fond de mes propres messages sur cette plateforme */
  softColor: string
  /** Logo aux couleurs officielles */
  logo: LogoComponent
  conversationWord: string
  composerPlaceholder: string
  /** Cette plateforme accepte-t-elle les messages vocaux ? */
  supportsVoice: boolean
  /** Ton attendu — repère pour rédiger les brouillons de réponse */
  tone: 'formel' | 'direct' | 'professionnel'
}

export const PLATFORMS = {
  email: {
    name: 'Gmail',
    color: '#EA4335',
    softColor: '#FDECEA',
    conversationWord: 'fil de discussion',
    composerPlaceholder: 'Rédiger une réponse…',
    supportsVoice: false,
    tone: 'formel',
    logo: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3.6 19h2.8v-7.6L2 8.1v9.3c0 .9.7 1.6 1.6 1.6Z" fill="#4285F4" />
        <path d="M17.6 19h2.8c.9 0 1.6-.7 1.6-1.6V8.1l-4.4 3.3V19Z" fill="#34A853" />
        <path d="M17.6 6.6v4.8L22 8.1V7c0-1.6-1.8-2.5-3.1-1.6l-1.3 1.2Z" fill="#FBBC04" />
        <path d="M6.4 11.4V6.6L12 10.8l5.6-4.2v4.8L12 15.6l-5.6-4.2Z" fill="#EA4335" />
        <path d="M2 7v1.1l4.4 3.3V6.6L5.1 5.4C3.8 4.5 2 5.4 2 7Z" fill="#C5221F" />
      </svg>
    ),
  },

  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    softColor: '#E6F8EE',
    conversationWord: 'discussion',
    composerPlaceholder: 'Écrire un message…',
    supportsVoice: true,
    tone: 'direct',
    logo: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M12 2.4a9.6 9.6 0 0 0-8.2 14.6L2.4 21.6l4.7-1.3A9.6 9.6 0 1 0 12 2.4Z"
          fill="#25D366"
        />
        <path
          d="M16.9 14.3c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1a7.7 7.7 0 0 1-3.8-3.4c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-1-2.1c-.2-.6-.5-.5-.7-.5h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.2.2 2 3.1 4.9 4.2 1.8.7 2.5.8 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.1-1.4 0-.2-.2-.3-.4-.4Z"
          fill="#fff"
        />
      </svg>
    ),
  },

  slack: {
    name: 'Slack',
    color: '#4A154B',
    softColor: '#F4EAF4',
    conversationWord: 'canal',
    composerPlaceholder: 'Envoyer un message…',
    supportsVoice: true,
    tone: 'direct',
    logo: (props) => (
      <svg viewBox="60 60 150 150" fill="none" {...props}>
        <path
          d="M99.4 151.2a12.9 12.9 0 1 1-12.9-12.9h12.9v12.9zM105.9 151.2a12.9 12.9 0 0 1 25.8 0v32.3a12.9 12.9 0 0 1-25.8 0v-32.3z"
          fill="#E01E5A"
        />
        <path
          d="M118.8 99.4a12.9 12.9 0 1 1 12.9-12.9v12.9h-12.9zM118.8 105.9a12.9 12.9 0 0 1 0 25.8H86.5a12.9 12.9 0 0 1 0-25.8h32.3z"
          fill="#36C5F0"
        />
        <path
          d="M170.6 118.8a12.9 12.9 0 1 1 12.9 12.9h-12.9v-12.9zM164.1 118.8a12.9 12.9 0 0 1-25.8 0V86.5a12.9 12.9 0 0 1 25.8 0v32.3z"
          fill="#2EB67D"
        />
        <path
          d="M151.2 170.6a12.9 12.9 0 1 1-12.9 12.9v-12.9h12.9zM151.2 164.1a12.9 12.9 0 0 1 0-25.8h32.3a12.9 12.9 0 0 1 0 25.8h-32.3z"
          fill="#ECB22E"
        />
      </svg>
    ),
  },

  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    softColor: '#E7F1FC',
    conversationWord: 'conversation',
    composerPlaceholder: 'Écrire un message…',
    supportsVoice: false,
    tone: 'professionnel',
    logo: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="4.4" fill="#0A66C2" />
        <circle cx="7.4" cy="7.6" r="1.7" fill="#fff" />
        <rect x="5.9" y="10.3" width="3" height="8.2" rx="0.4" fill="#fff" />
        <path
          d="M10.8 10.3h2.9v1.2a3.3 3.3 0 0 1 2.9-1.5c2.2 0 3.5 1.4 3.5 4v4.5h-3v-4c0-1.1-.4-1.8-1.4-1.8s-1.6.7-1.6 1.8v4h-3.3z"
          fill="#fff"
        />
      </svg>
    ),
  },

  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    softColor: '#FDE9F1',
    conversationWord: 'conversation',
    composerPlaceholder: 'Envoyer un message…',
    supportsVoice: true,
    tone: 'direct',
    logo: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <defs>
          <linearGradient id="eko-instagram" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC107" />
            <stop offset="0.35" stopColor="#F44336" />
            <stop offset="0.7" stopColor="#9C27B0" />
            <stop offset="1" stopColor="#3F51B5" />
          </linearGradient>
        </defs>
        <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" stroke="url(#eko-instagram)" strokeWidth="2.1" />
        <circle cx="12" cy="12" r="4" stroke="url(#eko-instagram)" strokeWidth="2.1" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="url(#eko-instagram)" />
      </svg>
    ),
  },

  teams: {
    name: 'Teams',
    color: '#5059C9',
    softColor: '#EDEEF9',
    conversationWord: 'conversation',
    composerPlaceholder: 'Écrire un message…',
    supportsVoice: true,
    tone: 'professionnel',
    logo: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="18.1" cy="6" r="2.4" fill="#5059C9" />
        <path
          d="M14.9 9.3h6c.6 0 1.1.5 1.1 1.1v4.1a3.3 3.3 0 0 1-3.3 3.3h-.5a3.3 3.3 0 0 1-3.3-3.3V9.3Z"
          fill="#5059C9"
        />
        <circle cx="10.6" cy="5.6" r="3" fill="#7B83EB" />
        <path
          d="M4.2 9.1h12.7v7.2a5 5 0 0 1-5 5h-2.7a5 5 0 0 1-5-5V9.1Z"
          fill="#7B83EB"
        />
        <rect x="1.6" y="6.3" width="11" height="11" rx="1.6" fill="#4B53BC" />
        <path d="M3.9 8.9h6.4v1.6H8.7v5.3H7.5v-5.3H3.9z" fill="#fff" />
      </svg>
    ),
  },
} as const satisfies Record<string, PlatformMeta>

/** Identifiant d'une plateforme : 'email' | 'whatsapp' | 'slack' | … */
export type PlatformId = keyof typeof PLATFORMS

/** Toutes les plateformes, dans l'ordre d'affichage du rail */
export const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[]

export function getPlatform(id: PlatformId): PlatformMeta {
  return PLATFORMS[id]
}
