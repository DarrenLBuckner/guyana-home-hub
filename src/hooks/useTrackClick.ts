export function useTrackClick() {
  const trackClick = ({
    action_type,
    source_page,
    property_id,
    agent_id,
  }: {
    action_type: 'whatsapp' | 'request_viewing' | 'email' | 'phone' | 'share'
    source_page: 'property_listing' | 'agent_profile' | 'search_results'
    property_id?: string
    agent_id?: string
  }) => {
    // Fire and forget — never block the user action
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type, source_page, property_id, agent_id }),
    }).catch(() => {
      // Silent fail — tracking must never break the UI
    })
  }

  return { trackClick }
}
