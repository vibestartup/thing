# @vibestartup/thing

the universal `Thing` primitive shared by every vibestartup SDK. zero runtime
deps on the platform — just types, URIs, and the `links.yml` schema.

a **Thing** is a file-backed, addressable, executable program. any "thing" in
the system (a CAD part, a PCB, a video, a BOM row, a vendor, an invoice, a
conversation) is represented uniformly by:

1. a bundle directory on the project VFS
2. an addressable URI: `thing://<project>/<kind>/<slug>[@<rev>]`
3. a `main.tsx` program that, when executed, produces a canonical op graph

```ts
import { parseUri, formatUri, parseLinksYml } from '@vibestartup/thing'

const uri = parseUri('thing://demo/part/flywheel@abc123')
// → { project: 'demo', kind: 'part', slug: 'flywheel', rev: 'abc123' }

const refs = parseLinksYml(fileContents)
// → validated { id, path?/uri?/url?, mode?, watch?, cache? }[]
```

MIT licensed.

## relationship to the rest of vibestartup

this package sits below every SDK (`@vibestartup/cad`, `/pcb`, `/ic`, `/sch`,
`/vse`, `/doc`). SDKs use it to format URIs for links/imports, and the host
editor uses it to parse `links.yml` + resolve cross-thing dependencies.

see [oss/README.md](../README.md) for the big-picture story.
