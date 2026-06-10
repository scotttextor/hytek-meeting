export function matchesQuery(name: string, query: string): boolean {
  if (!query.trim()) return true
  const nameParts = name.toLowerCase().split(/\s+/)
  const queryParts = query.toLowerCase().trim().split(/\s+/)
  return queryParts.every(qp => nameParts.some(np => np.startsWith(qp)))
}
