'use client'

import React, { useState } from 'react'

interface Filters {
  search: string
  category: string
  status: string
}

interface FiltersPanelProps {
  current: Filters
  onChange: (filters: Filters) => void
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ current, onChange }) => {
  const [local, setLocal] = useState(current)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(local)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Filtros</h2>

      <input
        type="text"
        placeholder="Buscar..."
        className="w-full border p-2 rounded"
        value={local.search}
        onChange={(e) => setLocal({ ...local, search: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded"
        value={local.category}
        onChange={(e) => setLocal({ ...local, category: e.target.value })}
      >
        <option value="">Todas</option>
        <option value="tech">Tecnología</option>
        <option value="marketing">Marketing</option>
      </select>

      <select
        className="w-full border p-2 rounded"
        value={local.status}
        onChange={(e) => setLocal({ ...local, status: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="pending">Pendiente</option>
        <option value="done">Hecho</option>
      </select>

      <button type="submit" className="w-full bg-[#1d2b44] text-white py-2 rounded">
        Aplicar
      </button>
    </form>
  )
}

export default FiltersPanel
