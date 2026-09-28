const FIGMA_HOSTS = new Set(["figma.com", "www.figma.com", "embed.figma.com"])

/**
 * Turns a stored Figma link (file, design, proto or an existing embed URL)
 * into a URL that is safe to put in an <iframe src>. Returns null for
 * anything that is not an https figma.com URL.
 */
export function toFigmaEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null

  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }

  if (url.protocol !== "https:" || !FIGMA_HOSTS.has(url.hostname)) return null

  // Already an embed URL: use as-is.
  if (url.hostname === "embed.figma.com" || url.pathname.startsWith("/embed")) {
    return url.toString()
  }

  const embed = new URL("https://www.figma.com/embed")
  embed.searchParams.set("embed_host", "spec-hub")
  embed.searchParams.set("url", url.toString())
  return embed.toString()
}

/** The original (non-embed) Figma URL, for "Open in Figma" links. */
export function toFigmaOpenUrl(raw: string | null | undefined): string | null {
  const embed = toFigmaEmbedUrl(raw)
  if (!embed) return null
  const url = new URL(embed)
  return url.searchParams.get("url") ?? embed
}
