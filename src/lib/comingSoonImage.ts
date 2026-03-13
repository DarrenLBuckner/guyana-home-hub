const COMING_SOON_IMAGE = '/images/coming-soon-property.svg'

/**
 * Check if a property is "Coming Soon" based on available_from.
 * Sentinel value '9999-12-31' = coming soon with no date.
 * A real future date also counts as coming soon.
 */
export function isComingSoon(availableFrom: string | null | undefined): boolean {
  if (!availableFrom) return false
  if (availableFrom === '9999-12-31') return true
  return new Date(availableFrom) > new Date()
}

/**
 * Prepend the branded "Coming Soon" placeholder as the first image
 * when a property is marked as Coming Soon. Returns images unchanged
 * if the property is not Coming Soon.
 */
export function getDisplayImages(
  images: string[] | undefined,
  availableFrom: string | null | undefined
): string[] {
  const realImages = images || []
  if (isComingSoon(availableFrom)) {
    return [COMING_SOON_IMAGE, ...realImages]
  }
  return realImages
}

export { COMING_SOON_IMAGE }
