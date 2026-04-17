import { describe, it, expect } from 'vitest'
import { parseLinksYml, stringifyLinksYml, linksToRefs, refsToLinks } from './links.ts'

describe('links.yml', () => {
  it('empty string returns empty array', () => {
    expect(parseLinksYml('')).toEqual([])
  })

  it('parses a typical links.yml', () => {
    const src = `
- id: control_fw
  path: ../../code/firmware/main.c
  watch: true
- id: gripper
  uri: thing://demo/part/gripper
  mode: reference
- id: bearing
  url: https://grabcad.com/x.step
  cache: true
`
    const parsed = parseLinksYml(src)
    expect(parsed).toHaveLength(3)
    expect(parsed[0]).toMatchObject({ id: 'control_fw', path: '../../code/firmware/main.c', watch: true })
  })

  it('refs round-trip', () => {
    const src = `
- id: a
  path: ./x.c
  watch: true
- id: b
  uri: thing://p/part/x
  mode: snapshot
- id: c
  url: https://example.com/x
  cache: false
`
    const refs = linksToRefs(parseLinksYml(src))
    const back = refsToLinks(refs)
    const src2 = stringifyLinksYml(back)
    expect(parseLinksYml(src2)).toEqual(parseLinksYml(src))
  })

  it('rejects multi-target entry', () => {
    const bad = `- id: x\n  path: a\n  url: http://b\n`
    expect(() => parseLinksYml(bad)).toThrow()
  })
})
