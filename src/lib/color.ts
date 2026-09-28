import type { CSSProperties } from "react"

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export const DEFAULT_BRAND = "#FF5F1F"

function expandHex(hex: string): string {
  const h = hex.slice(1)
  return h.length === 3 ? h.split("").map((c) => c + c).join("") : h
}

function relativeLuminance(hex: string): number {
  const h = expandHex(hex)
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Near-black or white, whichever has the higher contrast on `hex`. */
export function readableForeground(hex: string): string {
  const l = relativeLuminance(hex)
  const onDark = (1.05) / (l + 0.05) // contrast against white
  const onLight = (l + 0.05) / (0.0033 + 0.05) // contrast against #0A0A0B
  return onLight >= onDark ? "#0A0A0B" : "#FFFFFF"
}

/**
 * CSS variables that re-skin the shadcn `primary` colour with an
 * organisation's brand colour. Falls back to the default accent.
 */
export function brandStyle(primaryColor: string | null | undefined): CSSProperties {
  const brand = primaryColor && HEX.test(primaryColor) ? primaryColor : DEFAULT_BRAND
  return {
    "--primary": brand,
    "--primary-foreground": readableForeground(brand),
    "--ring": brand,
  } as CSSProperties
}
