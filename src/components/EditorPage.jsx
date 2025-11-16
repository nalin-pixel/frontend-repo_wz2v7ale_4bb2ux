import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CompassForm from './CompassForm'

const STORAGE_KEY = 'bmi_compassen'

export default function EditorPage() {
  const { id } = useParams()
  const [existing, setExisting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const found = list.find((i) => i.id === id)
      setExisting(found || null)
    } catch (e) {
      setExisting(null)
    }
  }, [id])

  return (
    <CompassForm
      existing={existing}
      onSaved={(data) => {
        if (!data) return
        // After saving, go to dashboard for clarity
        // navigate('/dashboard')
      }}
    />
  )
}
