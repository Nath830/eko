import { cx } from '../../lib/cx'

/** Barre grise animée affichée pendant qu'Eko « réfléchit ». */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-md bg-line', className)} />
}

/** Squelette type d'un bloc de texte généré. */
export function SkeletonLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cx('h-2.5', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}
