import { z } from 'zod'

/** individual link entry in links.yml */
export const LinkEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/),
  role: z.string().optional(),
  meta: z.record(z.unknown()).optional(),

  // target — exactly one of:
  path: z.string().optional(),           // relpath or bundled
  bundled: z.boolean().optional(),       // disambiguates path as bundled

  uri: z.string().optional(),            // thing://... linked
  mode: z.enum(['reference', 'snapshot']).optional(),

  url: z.string().url().optional(),      // external url
  cache: z.boolean().optional(),

  watch: z.boolean().optional(),         // for relpath
}).refine((e) => (e.path ? 1 : 0) + (e.uri ? 1 : 0) + (e.url ? 1 : 0) === 1, {
  message: 'exactly one of path/uri/url must be set',
})

export type LinkEntry = z.infer<typeof LinkEntrySchema>

export const LinksYmlSchema = z.array(LinkEntrySchema)
export type LinksYml = z.infer<typeof LinksYmlSchema>

/** meta.yml schema */
export const ThingMetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  owners: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  canonical: z.boolean().optional(),
}).passthrough()

export type ThingMetaParsed = z.infer<typeof ThingMetaSchema>
