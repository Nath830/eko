import { getPlatform, type PlatformId } from '../../config/platforms'

interface PlatformLogoProps {
  platform: PlatformId
  size?: number
  className?: string
}

/** Logo d'une plateforme, à ses couleurs officielles. */
export function PlatformLogo({ platform, size = 18, className }: PlatformLogoProps) {
  const { name, logo: Logo } = getPlatform(platform)

  return (
    <span className={className} title={name} aria-label={name} role="img">
      <Logo width={size} height={size} aria-hidden />
    </span>
  )
}
