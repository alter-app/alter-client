import AlterLogo from '@/assets/Alter-logo.png'

export function Navbar() {
  return (
    <div className="flex items-center justify-between w-full border border-line-1 px-4 h-14 bg-white">
      <div className="flex items-center w-6 h-6">
        <img src={AlterLogo} alt="logo" />
      </div>
    </div>
  )
}
