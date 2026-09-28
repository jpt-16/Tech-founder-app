import type { CSSProperties } from "react"

import type { DesignToken } from "@/types/models"

const TYPOGRAPHY_PROPS = {
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "line-height": "lineHeight",
  "letter-spacing": "letterSpacing",
  "text-transform": "textTransform",
} as const

/**
 * Parses a typography token value such as
 * `font-family: Inter; font-size: 16px; line-height: 24px; font-weight: 400`
 * into a style object. Only whitelisted font properties are kept.
 */
export function parseTypography(value: string): CSSProperties {
  const style: Record<string, string> = {}
  for (const decl of value.split(";")) {
    const idx = decl.indexOf(":")
    if (idx === -1) continue
    const prop = decl.slice(0, idx).trim().toLowerCase() as keyof typeof TYPOGRAPHY_PROPS
    const val = decl.slice(idx + 1).trim()
    if (prop in TYPOGRAPHY_PROPS && val && !/[<>{}]|url\(/i.test(val)) {
      style[TYPOGRAPHY_PROPS[prop]] = val
    }
  }
  return style as CSSProperties
}

/** Short "36px / 40px · 700" summary of a typography token. */
export function typographySummary(value: string): string {
  const s = parseTypography(value)
  const size = [s.fontSize, s.lineHeight].filter(Boolean).join(" / ")
  return [size, s.fontWeight].filter(Boolean).join(" · ") || value
}

/**
 * SVG icon tokens are rendered through a CSS mask (never injected as markup),
 * so scripts inside a stored SVG cannot run and the icon picks up the
 * current text colour.
 */
export function svgMaskStyle(svg: string): CSSProperties {
  const uri = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}")`
  return {
    maskImage: uri,
    WebkitMaskImage: uri,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    backgroundColor: "currentColor",
  }
}

export function groupTokens(tokens: DesignToken[]) {
  return {
    colors: tokens.filter((t) => t.token_category === "colors"),
    typography: tokens.filter((t) => t.token_category === "typography"),
    icons: tokens.filter((t) => t.token_category === "icons"),
  }
}
