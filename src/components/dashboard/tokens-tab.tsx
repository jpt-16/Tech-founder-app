import { Card } from "@/components/ui/card"
import { CopyButton } from "@/components/dashboard/copy-button"
import { groupTokens, parseTypography, svgMaskStyle, typographySummary } from "@/lib/tokens"
import type { DesignToken } from "@/types/models"

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <span className="text-muted-foreground font-mono text-xs">{count}</span>
      </div>
      {count === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-sm">
          No {title.toLowerCase()} tokens for this project yet.
        </p>
      ) : (
        children
      )}
    </section>
  )
}

function ColorCard({ token }: { token: DesignToken }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="h-24 border-b" style={{ backgroundColor: token.value }} aria-hidden />
      <div className="flex items-center gap-2 p-3 pl-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-mono text-sm font-medium">{token.key}</span>
          <span className="text-muted-foreground font-mono text-xs uppercase">{token.value}</span>
          {token.description && (
            <span className="text-muted-foreground truncate text-xs">{token.description}</span>
          )}
        </div>
        <CopyButton value={token.value} label={`Copy ${token.key}`} />
      </div>
    </Card>
  )
}

function TypographyRow({ token }: { token: DesignToken }) {
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
      <span className="min-w-0 flex-1 truncate" style={parseTypography(token.value)}>
        {token.description || token.key}
      </span>
      <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
        {token.key} · {typographySummary(token.value)}
      </span>
      <CopyButton value={token.value} label={`Copy ${token.key}`}>
        Copy CSS
      </CopyButton>
    </li>
  )
}

function IconCard({ token }: { token: DesignToken }) {
  return (
    <Card className="items-center gap-3 px-4 py-5 text-center">
      <span role="img" aria-label={token.key} className="size-8" style={svgMaskStyle(token.value)} />
      <span className="w-full truncate font-mono text-xs">{token.key}</span>
      <CopyButton value={token.value} label={`Copy ${token.key} SVG`}>
        Copy SVG
      </CopyButton>
    </Card>
  )
}

export function TokensTab({ tokens }: { tokens: DesignToken[] }) {
  const { colors, typography, icons } = groupTokens(tokens)

  return (
    <div className="flex flex-col gap-10">
      <Section title="Colors" count={colors.length}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colors.map((t) => (
            <ColorCard key={t.id} token={t} />
          ))}
        </div>
      </Section>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Section title="Typography" count={typography.length}>
          <Card className="py-0">
            <ul className="divide-y">
              {typography.map((t) => (
                <TypographyRow key={t.id} token={t} />
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Icons" count={icons.length}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {icons.map((t) => (
              <IconCard key={t.id} token={t} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
