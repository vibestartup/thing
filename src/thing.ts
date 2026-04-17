import type { ThingURI, ThingKind } from './uri.ts'
import type { Ref } from './ref.ts'
import type { Asset } from './asset.ts'

/** manifest parsed from .meta.yml */
export type ThingMeta = {
  title?: string
  description?: string
  owners?: string[]
  tags?: string[]
  /** auto-maintained by the lint pass */
  canonical?: boolean
  [k: string]: unknown
}

/** the canonical runtime representation of a Thing (index row + resolved refs). */
export type Thing = {
  id: string
  projectId: string
  projectSlug: string
  uri: ThingURI
  kind: ThingKind
  slug: string
  title: string
  description?: string
  filePath: string         // vfs path to the bundle dir
  fileHash: string         // sha256 of main.tsx
  stateHash?: string       // sha256 of state.json
  thumbUrl?: string
  tags: string[]
  canonical: boolean
  meta: ThingMeta
  createdAt: number
  updatedAt: number
}

export type ThingWithRefs = Thing & {
  refs: Ref[]
  assets: Asset[]
}
