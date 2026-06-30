export default function Header() {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-50 flex justify-between items-center h-16 px-6">
      <h2 className="text-headline-sm font-black text-primary">
        World Cup Manager
      </h2>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-sm">
            person
          </span>
        </div>
      </div>
    </header>
  )
}
