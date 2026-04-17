/**
 * Ref — a reference from one Thing to something else.
 *
 * four kinds:
 *   - bundled   : an asset file inside this Thing's bundle (assets/<path>)
 *   - linked    : another Thing (thing://...) — either 'reference' (live) or 'snapshot' (frozen)
 *   - relpath   : a file elsewhere in the project vfs (../../code/firmware/main.c)
 *   - url       : an external url (optionally cached into the bundle)
 */

import type { ThingURI } from './uri.ts'

export type RefKindBundled = {
  kind: 'bundled'
  /** path relative to the bundle root, e.g. 'assets/base.step' */
  path: string
}

export type RefKindLinked = {
  kind: 'linked'
  uri: ThingURI | string
  /** 'reference' = live; 'snapshot' = frozen copy stored under snapshots/<id>/ */
  mode: 'reference' | 'snapshot'
}

export type RefKindRelpath = {
  kind: 'relpath'
  /** project-vfs-relative or bundle-relative */
  path: string
  /** when true, owner re-executes on file change */
  watch?: boolean
}

export type RefKindUrl = {
  kind: 'url'
  url: string
  /** when true, fetched once and mirrored into assets/, hash pinned in lockfile */
  cache?: boolean
}

export type RefTarget = RefKindBundled | RefKindLinked | RefKindRelpath | RefKindUrl

export type Ref = {
  /** stable id within the owning Thing — used as SDK prop ("ref") */
  id: string
  target: RefTarget
  /** optional role hint for editors ('firmware', 'texture', 'drawing', …) */
  role?: string
  /** editor-owned metadata (e.g. x/y transform for an Import) */
  meta?: Record<string, unknown>
}

export function refTargetHash(t: RefTarget): string {
  switch (t.kind) {
    case 'bundled': return `bundled:${t.path}`
    case 'linked':  return `linked:${typeof t.uri === 'string' ? t.uri : `${t.uri.project}/${t.uri.kind}/${t.uri.slug}`}:${t.mode}`
    case 'relpath': return `relpath:${t.path}`
    case 'url':     return `url:${t.url}`
  }
}
