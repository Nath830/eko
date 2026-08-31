/* Recherche insensible à la casse ET aux accents : « eleve » trouve « élevé ». */

import type { Conversation, Message } from '../types'

/** Version simplifiée d'un texte, en gardant la position de chaque caractère
    d'origine — indispensable pour surligner le bon endroit ensuite. */
function normalizeWithMap(text: string): { normalized: string; map: number[] } {
  let normalized = ''
  const map: number[] = []

  for (let i = 0; i < text.length; i++) {
    const simplified = text[i]
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()

    for (const character of simplified) {
      normalized += character
      map.push(i)
    }
  }

  return { normalized, map }
}

export function normalize(text: string): string {
  return normalizeWithMap(text).normalized
}

/** Position d'un terme recherché dans un texte, accents ignorés */
export function findMatchRange(text: string, query: string): [number, number] | null {
  const trimmed = query.trim()
  if (!trimmed) return null

  const { normalized, map } = normalizeWithMap(text)
  const needle = normalize(trimmed)
  const index = normalized.indexOf(needle)
  if (index === -1) return null

  return [map[index], map[index + needle.length - 1] + 1]
}

export function textMatches(text: string | undefined, query: string): boolean {
  return Boolean(text) && findMatchRange(text as string, query) !== null
}

/** Premier message d'une conversation correspondant à la recherche */
export function findMatchingMessage(conversation: Conversation, query: string): Message | undefined {
  return [...conversation.messages]
    .reverse()
    .find((message) => textMatches(message.text, query) || textMatches(message.voice?.transcript, query))
}

/** La conversation correspond-elle à la recherche ? (nom, objet, contenu…) */
export function conversationMatches(conversation: Conversation, query: string): boolean {
  if (!query.trim()) return true

  return (
    textMatches(conversation.title, query) ||
    textMatches(conversation.subtitle, query) ||
    textMatches(conversation.subject, query) ||
    textMatches(conversation.ekoDigest, query) ||
    conversation.messages.some(
      (message) =>
        textMatches(message.text, query) ||
        textMatches(message.authorName, query) ||
        textMatches(message.voice?.transcript, query) ||
        message.attachments?.some((attachment) => textMatches(attachment.fileName, query)),
    )
  )
}

/** Extrait court centré sur le terme recherché : « …le devis détaillé pour… » */
export function excerptAround(text: string, query: string, radius = 34): string {
  const singleLine = text.replace(/\s+/g, ' ').trim()
  const range = findMatchRange(singleLine, query)
  if (!range) return singleLine

  const start = Math.max(0, range[0] - radius)
  const end = Math.min(singleLine.length, range[1] + radius)

  return `${start > 0 ? '…' : ''}${singleLine.slice(start, end)}${end < singleLine.length ? '…' : ''}`
}
