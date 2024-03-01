import { describe, expect, it } from 'vitest'
import BeautifulChangelogPlugin from '../src'

describe('should', () => {
  it('plugin should be exported correctly', () => {
    expect(BeautifulChangelogPlugin).not.toBeNull()
  })
})
