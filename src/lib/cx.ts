/** Assemble des classes CSS en ignorant celles qui sont désactivées. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
