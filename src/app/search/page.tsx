'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/* ---------- 1. Define the shape of one card ---------- */
interface PropertyCard {
  id: string
  title: string
  price: number
  status: string
  property_images: { url: string }[]
}

export default function SearchPage() {
  const params = useSearchParams()
  const q = params.get('q') || ''

  /* ---------- 2. Use the typed array instead of any[] ---------- */
  const [results, setResults] = useState<PropertyCard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    fetch(`/api/properties/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for “{q}”
      </h1>

      {loading && <p>Loading…</p>}
      {!loading && results.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-medium mb-1">{p.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              ${p.price?.toLocaleString()}
            </p>

            {p.property_images?.[0]?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.property_images[0].url}
                alt={p.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
