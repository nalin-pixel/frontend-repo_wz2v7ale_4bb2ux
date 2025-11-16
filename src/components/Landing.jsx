import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-[#003D5C]"></div>
            <div className="leading-tight">
              <p className="font-semibold text-[#003D5C]">Bestuurlijk Kompas</p>
              <p className="text-xs text-slate-500">Besturen met Impact</p>
            </div>
          </div>
          <nav className="text-sm">
            <Link to="/dashboard" className="text-[#003D5C] hover:underline">Mijn compassen</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#003D5C] tracking-tight">
              Van 40 pagina's naar één A4
            </h1>
            <p className="mt-5 text-slate-700 leading-relaxed">
              Transformeer complexe beleidsdossiers naar een heldere, strategische briefing. Het Bestuurlijk Kompas helpt je om snel te zien wat ertoe doet — professioneel, politiek, in de omgeving en in de media — en of het past bij de bestuurder.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/nieuw"
                className="inline-flex items-center gap-2 bg-[#F7B500] text-white font-medium px-5 py-3 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F7B500]/30"
                aria-label="Start nieuw kompas"
              >
                Start nieuw kompas
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="text-[#003D5C] hover:underline">
                Bekijk opgeslagen compassen
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="h-6 w-6 flex items-center justify-center rounded-sm bg-[#003D5C] text-white text-xs font-semibold">1</span>
                <div>
                  <p className="font-medium text-slate-900">Start direct met invullen</p>
                  <p className="text-slate-600">Geen gedoe. Vul de kerninformatie van je dossier in per perspectief.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="h-6 w-6 flex items-center justify-center rounded-sm bg-[#003D5C] text-white text-xs font-semibold">2</span>
                <div>
                  <p className="font-medium text-slate-900">Automatisch opslaan</p>
                  <p className="text-slate-600">Je werk wordt elke 30 seconden opgeslagen in je browser.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="h-6 w-6 flex items-center justify-center rounded-sm bg-[#003D5C] text-white text-xs font-semibold">3</span>
                <div>
                  <p className="font-medium text-slate-900">Exporteer naar PDF</p>
                  <p className="text-slate-600">Maak een nette A4-briefing die geschikt is voor bestuur en raad.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Besturen met Impact</span>
          <span>Professionele tooling voor gemeenten</span>
        </div>
      </footer>
    </div>
  )
}
