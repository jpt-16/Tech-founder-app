"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  /** Accessible name, e.g. "Copy brand-primary". */
  label: string
  /** Visible text; omit for an icon-only button. */
  children?: React.ReactNode
  className?: string
}

export function CopyButton({ value, label, children, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Copied to clipboard", { description: label.replace(/^Copy /, "") })
    } catch {
      toast.error("Couldn't copy", { description: "Your browser blocked clipboard access." })
    }
  }

  const Icon = copied ? CheckIcon : CopyIcon

  return (
    <Button
      type="button"
      variant="outline"
      size={children ? "sm" : "icon"}
      onClick={copy}
      aria-label={children ? undefined : label}
      className={cn(!children && "size-11 shrink-0", className)}
    >
      <Icon aria-hidden />
      {children}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </Button>
  )
}
