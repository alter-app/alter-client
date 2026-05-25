import alterLogo from '@/assets/alter_logo.svg'
import { cn } from '@/shared/lib/utils'

interface AlterLogoProps {
  className?: string
  alt?: string
}

export function AlterLogo({ className, alt = '알터 로고' }: AlterLogoProps) {
  return <img src={alterLogo} alt={alt} className={cn(className)} />
}
