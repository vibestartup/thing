import { describe, it, expect } from 'vitest'
import { parseUri, formatUri, isThingUri, thingPath, thingVfsPath } from './uri.ts'

describe('ThingURI', () => {
  it('parses bare uri', () => {
    expect(parseUri('thing://demo/part/flywheel')).toEqual({ project: 'demo', kind: 'part', slug: 'flywheel' })
  })
  it('parses revisioned uri', () => {
    expect(parseUri('thing://demo/pcb/main-board@abc12345')).toEqual({ project: 'demo', kind: 'pcb', slug: 'main-board', rev: 'abc12345' })
  })
  it('round-trips', () => {
    const s = 'thing://demo/part/flywheel@abcdef01'
    expect(formatUri(parseUri(s))).toBe(s)
  })
  it('rejects malformed', () => {
    expect(() => parseUri('not-a-uri')).toThrow()
    expect(() => parseUri('thing://DEMO/part/x')).toThrow()
  })
  it('isThingUri', () => {
    expect(isThingUri('thing://a/b/c')).toBe(true)
    expect(isThingUri('xxx')).toBe(false)
  })
  it('vfs paths', () => {
    expect(thingPath('part', 'flywheel')).toBe('/things/part/flywheel')
    expect(thingVfsPath('demo', 'part', 'flywheel')).toBe('/projects/demo/things/part/flywheel')
  })
})
