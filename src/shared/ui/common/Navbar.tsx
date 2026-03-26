import AlterLogo from '@/assets/Alter-logo.png'
import AlterLogotext from '@/assets/Alter-logo-text.png'
import BellIcon from '@/assets/icons/bell.svg'
import MenuIcon from '@/assets/icons/menu.svg'

export function Navbar() {
  return (
    <div className="flex items-center justify-between w-full border-b border-line-1 px-4 h-14 bg-white">
      <div className="flex items-center gap-2">
        <img src={AlterLogo} alt="logo" className="w-7 h-7" />
        <img src={AlterLogotext} alt="logo-text" />
      </div>
      <div className="flex items-center gap-4 w-6 h-6">
        <img src={BellIcon} alt="bell" className="cursor-pointer" />
        <img src={MenuIcon} alt="menu" className="cursor-pointer" />
      </div>
    </div>
  )
}
