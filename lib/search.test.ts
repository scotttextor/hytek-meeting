import { describe, it, expect } from 'vitest'
import { matchesQuery } from './search'

describe('matchesQuery', () => {
  it('returns true for empty query', () => {
    expect(matchesQuery('Jason Smith', '')).toBe(true)
  })

  it('matches single letter against first name start', () => {
    expect(matchesQuery('Jason Smith', 'j')).toBe(true)
    expect(matchesQuery('Alan Brown', 'j')).toBe(false)
  })

  it('matches first name prefix', () => {
    expect(matchesQuery('Jason Smith', 'jason')).toBe(true)
    expect(matchesQuery('Jason Langdon', 'jason')).toBe(true)
    expect(matchesQuery('Joel Petrak', 'jason')).toBe(false)
  })

  it('matches two-word query against first + last name', () => {
    expect(matchesQuery('Jason Smith', 'jason s')).toBe(true)
    expect(matchesQuery('Jason Wong', 'jason s')).toBe(false)
    expect(matchesQuery('Jason Smith', 'j sm')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(matchesQuery('Jason Smith', 'JASON')).toBe(true)
    expect(matchesQuery('jason smith', 'J')).toBe(true)
  })

  it('handles names with apostrophes', () => {
    expect(matchesQuery("Jayden O'Toole", 'jayden')).toBe(true)
    expect(matchesQuery("Jayden O'Toole", 'jayden o')).toBe(true)
  })

  it('matches last name prefix', () => {
    expect(matchesQuery('Jason Smith', 'smith')).toBe(true)
  })

  it('does not match mid-word substring', () => {
    expect(matchesQuery('Jason Smith', 'ason')).toBe(false)
  })
})
