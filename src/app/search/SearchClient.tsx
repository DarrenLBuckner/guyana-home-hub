'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/** ---------- 1. Shape of a property card ---------- */
interface PropertyCard {
  id: string
  title: string
  price: number
  status: string
  hero_image?: string
  image_urls?: string[]
}

/** ---------- 2. Client component ---------- */
export default function SearchClient() {
  const params = useSearchParams()
  const q = params.get('q')?.trim() ?? ''

  const [results, setResults] = useState<PropertyCard[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // if no search term, clear results
    if (!q) {
      setResults([])
      return
    }

    setLoading(true)
    fetch(`/api/properties/search?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: PropertyCard[]) => {
        setResults(data)
      })
      .catch((err) => {
        console.error('Search error:', err)
        setResults([])
      })
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
        {results.map((p) => {
          // pick hero_image if set, otherwise first image_urls entry
          const imageUrl = p.hero_image || p.image_urls?.[0] || ''
          return (
            <div key={p.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-medium mb-1">{p.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                ${p.price.toLocaleString()}
              </p>

              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
