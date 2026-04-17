/** a binary sibling inside a Thing bundle. */
export type Asset = {
  /** path within bundle, e.g. 'assets/base.step' */
  path: string
  /** sha256 hex */
  hash: string
  /** size in bytes */
  size: number
  /** mime, sniffed from extension or content */
  mime?: string
}
