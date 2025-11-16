import { useEffect, useMemo, useState } from 'react'
import { Calendar, ClipboardList, Users, Newspaper, Landmark, MessageSquare, User, Save, FileDown, Plus } from 'lucide-react'

const primary = '#003D5C'
const accent = '#F7B500'

const initialData = () => ({
  id: crypto.randomUUID(),
  title: '',
  municipality: '',
  date: new Date().toISOString().split('T')[0],
  professioneel: '',
  omgeving: '',
  media: '',
  politiek: '',
  persoonlijk: '',
  stakeholders: '',
  kansen: '',
  risico: '',
  impact: '',
  beslismoment: '',
  progress: 0,
})

const STORAGE_KEY = 'bmi_compassen'

function useAutoSave(data, setData) {
  // Recompute progress
  const fields = ['title','municipality','professioneel','omgeving','media','politiek','persoonlijk','stakeholders','kansen','risico','impact','beslismoment']
  useEffect(() => {
    const filled = fields.filter((f) => (data[f] ?? '').toString().trim().length > 0).length
    const progress = Math.round((filled / fields.length) * 100)
    setData((d) => ({ ...d, progress }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.title, data.municipality, data.professioneel, data.omgeving, data.media, data.politiek, data.persoonlijk, data.stakeholders, data.kansen, data.risico, data.impact, data.beslismoment])

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const updated = list.some((i) => i.id === data.id)
          ? list.map((i) => (i.id === data.id ? data : i))
          : [...list, data]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        // ignore
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [data])
}

export default function CompassForm({ existing, onSaved }) {
  const [data, setData] = useState(existing || initialData())

  useAutoSave(data, setData)

  const saveNow = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const updated = list.some((i) => i.id === data.id)
      ? list.map((i) => (i.id === data.id ? data : i))
      : [...list, data]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    onSaved && onSaved(data)
  }

  const startNew = () => {
    onSaved && onSaved(null)
    setData(initialData())
  }

  const handle = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }))

  const Section = ({ icon: Icon, title, placeholder, value, onChange }) => (
    <div className="border border-slate-200 rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} color={primary} />
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <textarea
        className="w-full min-h-[110px] text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20 border border-slate-200 rounded p-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    const margin = 40
    let y = margin
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(0, 61, 92)
    doc.text('Bestuurlijk Kompas', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(60)
    doc.text('besturenmetimpact.nl', pageWidth - margin - 130, y)

    // Title block
    y += 24
    doc.setDrawColor(0, 61, 92)
    doc.setLineWidth(1)
    doc.line(margin, y, pageWidth - margin, y)
    y += 24

    doc.setTextColor(0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(data.title || 'Titel dossier', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    y += 16
    doc.text(`Gemeente: ${data.municipality || '-'}`, margin, y)
    y += 14
    doc.text(`Datum: ${data.date || '-'}`, margin, y)
    y += 20

    const block = (label, content) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 61, 92)
      doc.text(label, margin, y)
      y += 12
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(0)
      const split = doc.splitTextToSize(content || '-', pageWidth - margin * 2)
      doc.text(split, margin, y)
      y += split.length * 12 + 10
    }

    block('PROFESSIONEEL – Wat is de ambtelijke afweging?', data.professioneel)
    block('OMGEVING – Hoe reageert de samenleving?', data.omgeving)
    block('MEDIA – Welke krantenkoppen zijn denkbaar?', data.media)
    block('POLITIEK – Wat vindt de raad ervan?', data.politiek)
    block('PERSOONLIJK – Past dit bij de visie van de bestuurder?', data.persoonlijk)

    block('Belangrijkste spelers', data.stakeholders)
    block('Kansen', data.kansen)
    block('Risico\'s', data.risico)
    block('Maatschappelijke impact', data.impact)
    block('Beslismoment', data.beslismoment)

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - margin
    doc.setFontSize(9)
    doc.setTextColor(80)
    doc.text('Bestuurlijk Kompas | besturenmetimpact.nl', margin, footerY)

    doc.save(`${(data.title || 'kompas').replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-sm" style={{ backgroundColor: primary }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: primary }}>Bestuurlijk Kompas</p>
              <p className="text-xs text-slate-500">Besturen met Impact</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="w-40 h-2 bg-slate-200 rounded overflow-hidden" aria-hidden>
              <div className="h-full" style={{ width: `${data.progress}%`, backgroundColor: accent }} />
            </div>
            <span>{data.progress}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <section className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Dossiertitel</label>
            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20"
              placeholder="Bijvoorbeeld: Herinrichting binnenstad"
              value={data.title}
              onChange={handle('title')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Gemeente</label>
            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20"
              placeholder="Bijv. Gemeente X"
              value={data.municipality}
              onChange={handle('municipality')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 mt-4">Datum</label>
            <input
              type="date"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20"
              value={data.date}
              onChange={handle('date')}
            />
          </div>
        </section>

        <section className="mt-6 grid md:grid-cols-2 gap-4">
          <Section
            icon={ClipboardList}
            title="PROFESSIONEEL"
            placeholder="Wat is de ambtelijke afweging?"
            value={data.professioneel}
            onChange={handle('professioneel')}
          />
          <Section
            icon={Users}
            title="OMGEVING"
            placeholder="Hoe reageert de samenleving?"
            value={data.omgeving}
            onChange={handle('omgeving')}
          />
          <Section
            icon={Newspaper}
            title="MEDIA"
            placeholder="Welke krantenkoppen zijn denkbaar?"
            value={data.media}
            onChange={handle('media')}
          />
          <Section
            icon={Landmark}
            title="POLITIEK"
            placeholder="Wat vindt de raad ervan?"
            value={data.politiek}
            onChange={handle('politiek')}
          />
          <Section
            icon={User}
            title="PERSOONLIJK"
            placeholder="Past dit bij de visie van de bestuurder?"
            value={data.persoonlijk}
            onChange={handle('persoonlijk')}
          />
        </section>

        <section className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} color={primary} />
              <h3 className="text-sm font-semibold text-slate-800">Belangrijkste spelers</h3>
            </div>
            <textarea
              className="w-full min-h-[120px] text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20 border border-slate-200 rounded p-2"
              placeholder="Bijv. ondernemersvereniging, wijkraad, provincie, onderwijsinstellingen"
              value={data.stakeholders}
              onChange={handle('stakeholders')}
            />
          </div>
          <div className="border border-slate-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} color={primary} />
              <h3 className="text-sm font-semibold text-slate-800">Kansen</h3>
            </div>
            <textarea
              className="w-full min-h-[120px] text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20 border border-slate-200 rounded p-2"
              placeholder="Waar liggen de mogelijkheden?"
              value={data.kansen}
              onChange={handle('kansen')}
            />
          </div>
          <div className="border border-slate-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} color={primary} />
              <h3 className="text-sm font-semibold text-slate-800">Risico's</h3>
            </div>
            <textarea
              className="w-full min-h-[120px] text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20 border border-slate-200 rounded p-2"
              placeholder="Wat kan er misgaan en hoe mitigeren we dat?"
              value={data.risico}
              onChange={handle('risico')}
            />
          </div>
          <div className="border border-slate-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} color={primary} />
              <h3 className="text-sm font-semibold text-slate-800">Maatschappelijke impact</h3>
            </div>
            <textarea
              className="w-full min-h-[120px] text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20 border border-slate-200 rounded p-2"
              placeholder="Wat is het effect voor inwoners en organisaties?"
              value={data.impact}
              onChange={handle('impact')}
            />
          </div>
          <div className="border border-slate-200 rounded-md p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} color={primary} />
              <h3 className="text-sm font-semibold text-slate-800">Beslismoment</h3>
            </div>
            <input
              type="date"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003D5C]/20"
              value={data.beslismoment}
              onChange={handle('beslismoment')}
            />
          </div>
        </section>

        <section className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={saveNow} className="inline-flex items-center gap-2 border border-slate-300 text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-200">
            <Save size={16} /> Opslaan
          </button>
          <button onClick={exportPDF} className="inline-flex items-center gap-2 bg-[#F7B500] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F7B500]/30">
            <FileDown size={16} /> Exporteer als PDF
          </button>
          <button onClick={startNew} className="text-sm text-[#003D5C] hover:underline inline-flex items-center gap-1">
            <Plus size={16} /> Nieuw kompas
          </button>
        </section>
      </main>
    </div>
  )
}
