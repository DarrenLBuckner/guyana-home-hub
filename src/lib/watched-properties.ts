// localStorage utility for watched/saved properties
// src/lib/watched-properties.ts

const STORAGE_KEY = 'guyana_homehub_watched_properties'

export interface WatchedPropertiesData {
  propertyIds: string[]
  updatedAt: string
}

export function getWatchedProperties(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const data: WatchedPropertiesData = JSON.parse(stored)
    return data.propertyIds || []
  } catch {
    return []
  }
}

export function isPropertyWatched(propertyId: string): boolean {
  const watched = getWatchedProperties()
  return watched.includes(propertyId)
}

export function addToWatched(propertyId: string): void {
  if (typeof window === 'undefined') return

  const watched = getWatchedProperties()

  if (!watched.includes(propertyId)) {
    const updated: WatchedPropertiesData = {
      propertyIds: [...watched, propertyId],
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
}

export function removeFromWatched(propertyId: string): void {
  if (typeof window === 'undefined') return

  const watched = getWatchedProperties()
  const updated: WatchedPropertiesData = {
    propertyIds: watched.filter(id => id !== propertyId),
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function toggleWatched(propertyId: string): boolean {
  if (isPropertyWatched(propertyId)) {
    removeFromWatched(propertyId)
    return false // Now unwatched
  } else {
    addToWatched(propertyId)
    return true // Now watched
  }
}

export function getWatchedCount(): number {
  return getWatchedProperties().length
}

export function clearAllWatched(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
