/**
 * ThingURI — canonical addressable id for every Thing.
 *
 *   thing://<project>/<kind>/<slug>[@<rev>]
 *
 * project: slug of the owning project
 * kind: one of 'part' | 'pcb' | 'ic' | 'sch' | 'vse' | 'doc' | 'bom' | 'vendor' | ...
 *       (open set — sdks register kinds)
 * slug: unique within (project, kind), matches /^[a-z0-9][a-z0-9_-]*$/
 * rev: optional content-addressed revision (sha256 prefix, 8-40 hex chars)
 */

export type ThingKind = string

export type ThingURI = {
  project: string
  kind: ThingKind
  slug: string
  rev?: string
}

const URI_RE = /^thing:\/\/([a-z0-9][a-z0-9_-]*)\/([a-z0-9][a-z0-9_-]*)\/([a-z0-9][a-z0-9_-]*)(?:@([a-f0-9]{8,40}))?$/

export function parseUri(s: string): ThingURI {
  const m = URI_RE.exec(s)
  if (!m) throw new Error(`invalid thing uri: ${s}`)
  const uri: ThingURI = { project: m[1], kind: m[2], slug: m[3] }
  if (m[4]) uri.rev = m[4]
  return uri
}

export function tryParseUri(s: string): ThingURI | null {
  try { return parseUri(s) } catch { return null }
}

export function formatUri(u: ThingURI): string {
  const base = `thing://${u.project}/${u.kind}/${u.slug}`
  return u.rev ? `${base}@${u.rev}` : base
}

export function isThingUri(s: string): boolean {
  return URI_RE.test(s)
}

/** canonical filesystem path for a thing within a project vfs */
export function thingPath(kind: ThingKind, slug: string): string {
  return `/things/${kind}/${slug}`
}

/** full project-rooted path */
export function thingVfsPath(projectSlug: string, kind: ThingKind, slug: string): string {
  return `/projects/${projectSlug}${thingPath(kind, slug)}`
}
