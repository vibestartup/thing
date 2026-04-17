import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { LinksYmlSchema, type LinksYml } from './schema.ts'
import type { Ref, RefTarget } from './ref.ts'
import { parseUri, tryParseUri } from './uri.ts'

export const LINKS_FILE = 'links.yml'

export function parseLinksYml(source: string): LinksYml {
  if (!source.trim()) return []
  const raw = parseYaml(source)
  return LinksYmlSchema.parse(raw)
}

export function stringifyLinksYml(links: LinksYml): string {
  return stringifyYaml(LinksYmlSchema.parse(links))
}

export function linksToRefs(links: LinksYml): Ref[] {
  return links.map((entry): Ref => {
    const { id, role, meta, ...rest } = entry
    let target: RefTarget
    if ('path' in rest && 'bundled' in rest && rest.bundled) {
      target = { kind: 'bundled', path: rest.path as string }
    } else if ('path' in rest && typeof rest.path === 'string') {
      target = { kind: 'relpath', path: rest.path, watch: rest.watch }
    } else if ('uri' in rest && typeof rest.uri === 'string') {
      const parsed = tryParseUri(rest.uri) ?? rest.uri
      target = { kind: 'linked', uri: parsed, mode: (rest.mode ?? 'reference') as 'reference' | 'snapshot' }
    } else if ('url' in rest && typeof rest.url === 'string') {
      target = { kind: 'url', url: rest.url, cache: rest.cache }
    } else {
      throw new Error(`links.yml entry "${id}" has no valid target`)
    }
    return { id, target, role, meta }
  })
}

export function refsToLinks(refs: Ref[]): LinksYml {
  return refs
    .filter((r) => r.target.kind !== 'bundled' || (r.meta && r.meta.bundledInLinks))
    .map((r): LinksYml[number] => {
      const id = r.id
      const role = r.role
      const meta = r.meta
      switch (r.target.kind) {
        case 'bundled':
          return { id, role, meta, path: r.target.path, bundled: true } as LinksYml[number]
        case 'relpath':
          return { id, role, meta, path: r.target.path, watch: r.target.watch } as LinksYml[number]
        case 'linked': {
          const uri = typeof r.target.uri === 'string'
            ? r.target.uri
            : `thing://${r.target.uri.project}/${r.target.uri.kind}/${r.target.uri.slug}${r.target.uri.rev ? `@${r.target.uri.rev}` : ''}`
          return { id, role, meta, uri, mode: r.target.mode } as LinksYml[number]
        }
        case 'url':
          return { id, role, meta, url: r.target.url, cache: r.target.cache } as LinksYml[number]
      }
    })
}

export { parseUri, tryParseUri }
