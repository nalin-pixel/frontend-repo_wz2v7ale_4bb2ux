import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Trash2, Plus } from 'lucide-react'

const STORAGE_KEY = 'bmi_compassen'
const primary = '#003D5C'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setItems(list.sort((a,b) => (b.updatedAt || 0) - (a.updatedAt || 0)))
  }, [])

  const remove = (id) => {
    const filtered = items.filter((i) => i.id !== id)
    setItems(filtered)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm" style={{ backgroundColor: primary }}></div>
            <div className="leading-tight">
              <p className="font-semibold" style={{ color: primary }}>Bestuurlijk Kompas</p>
              <p className="text-xs text-slate-500">Mijn compassen</p>
            </div>
          </div>
          <button onClick={() => navigate('/nieuw')} className="inline-flex items-center gap-2 bg-[#F7B500] text-white px-3 py-2 rounded-md text-sm">
            <Plus size={16} /> Nieuw kompas
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          <div className="text-center text-slate-600">
            <p className="mb-4">Nog geen compassen opgeslagen.</p>
            <Link to="/nieuw" className="text-[#003D5C] hover:underline">Maak je eerste kompas</Link>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {items.map((it) => (
              <li key={it.id} className="border border-slate-200 rounded-md p-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <FileText size={16} color={primary} /> {it.title || 'Zonder titel'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{it.municipality || 'Onbekende gemeente'} • {it.date || ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/bewerken/${it.id}`} className="text-sm text-[#003D5C] hover:underline">Open</Link>
                  <button onClick={() => remove(it.id)} className="text-slate-500 hover:text-red-600" aria-label="Verwijder">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
